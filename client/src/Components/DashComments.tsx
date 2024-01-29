import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import tick from '../assets/tick.svg'
import cross from '../assets/cross.svg'

import styles from '../styles/modules/dashComments.module.scss'

export default function DashComments() {
  const { currentUser } = useSelector((state:any) => state.user)

  const [comments, setComments] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState<any>('')
  
  useEffect(() => { 
    const fetchComments = async() => {
      try {
        const res = await fetch(`/api/comment/getcomments`)
        const data = await res.json()
        if(res.ok) {
          setComments(data.comments);
          if(data.comments.length < 12) {
            setShowMore(false)
          }
        }
      } catch (error:any) {
        console.log(error.message);
                
      }
    };
    if(currentUser.isAdmin) {
      fetchComments()
    }
  }, [currentUser._id])

  const handleShowMore = async() => {
    const startIndex = comments.length;
    try {
      const res= await fetch(`api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok) {
        setComments((prev) => [...prev, ...data.comments])
        if(data.comments.length < 12) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  const handleDeleteComment = async () =>{
    setShowModal(false)
    try {
        const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
            method: 'DELETE'
        })
        const data = await res.json()
        if(res.ok) {
            setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
        } else {
            console.log(data.message);
        }
    } catch (error:any) {
        console.log(error.message);
        
    }
  }
  
  return (
    <div>
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
        <div>
          <div className="dateCreated">
            <p>Дата создания</p>
          </div>
          <div className="">
            <p>Комментарий</p>
          </div>
          <div className="">
            <p>Лайки</p>
          </div>
          <div className="">
            <p>Пост</p>
          </div>
          <div className="">
            <p>Пользователь</p>
          </div>
        </div>
        <div className="content">
          {
            comments.map((comment: any) => (
              <div key={comment._id} className={styles.commentLine}>
                <div>{new Date(comment.updatedAt).toLocaleDateString()}</div>
                <div className={styles.commentContent}>{comment.content}</div>
                <div>{comment.numberOfLikes}</div>
                <div>{comment.postId}</div>
                <div>{comment.userId}</div>
                <button 
                  onClick={() => {
                    setShowModal(true);
                    setCommentIdToDelete(comment._id);
                }}>
                Удалить</button>
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
        'no comments'
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
                    <h1>Вы уверены что хотите удалить комментарий</h1>
                    <div className="interaction">
                        <button onClick={handleDeleteComment}>
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
