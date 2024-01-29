import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom";

import styles from '../styles/modules/dashPosts.module.scss'

export default function DashPosts() {
  const { currentUser } = useSelector((state:any) => state.user)

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [postIdToDelete, setPostIdToDelete] = useState<any>('')
  
  useEffect(() => { 
    const fetchPosts = async() => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok) {
          setUserPosts(data.posts);
          if(data.posts.length < 12) {
            setShowMore(false)
          }
        }
      } catch (error:any) {
        console.log(error.message);
                
      }
    };
    if(currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id])

  const handleShowMore = async() => {
    const startIndex = userPosts.length;
    try {
      const res= await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])
        if(data.posts.length < 12) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE'
      })

      const data = await res.json();
      if(!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev: any) => prev.filter((post: any) => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
        <div>
          <div className="dateUpdated">
            <p>Дата</p>
          </div>
          <div className="postImage">
            <p>Фото</p>
          </div>
          <div className="postTitle">
            <p>Название</p>
          </div>
          <div className="category">
            <p>Категория</p>
          </div>
          <div className="deletePost">
            <p>Удалить</p>
          </div>
          <div className="editePost">
            <p>Редактировать</p>
          </div>
        </div>
        <div className="content">
          {
            userPosts.map((post: any) => (
              <div key={post.title}>
                <div>{new Date(post.updatedAt).toLocaleDateString()}</div>
                <div>
                  <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} />
                  </Link>
                </div>
                <div>
                  <Link to={`/post/${post.slug}`}>
                    {post.title}
                  </Link>
                </div>
                <div>{post.category}</div>
                <button 
                  onClick={() => {
                    setShowModal(true);
                    setPostIdToDelete(post._id);
                }}>
                Удалить</button>
                <button>
                  <Link to={`/update-post/${post._id}`}>Редактировать</Link>
                </button>
              </div>
            ))
          }
        </div>
        {
          showMore && (
            <button onClick={handleShowMore}>Показать ещё</button>
          )
        }
        </>
      ) : (
        'no posts'
      )}
      {showModal && (
            <div className={styles.modal}>
                <div className="container">
                    <button onClick={()=> setShowModal(false)} className="closeModal">
                        <img src="" alt="x" />
                    </button>
                    <div className="exclamation">
                        <img src="" alt="!" />
                    </div>
                    <h1>Вы уверены что хотите удалить статью</h1>
                    <div className="interaction">
                        <button onClick={handleDeletePost}>
                            Подтвердить
                        </button>
                        <button onClick={() => setShowModal(false)}>
                            Отменить
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}
