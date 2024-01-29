import { useEffect, useState } from "react"
import { AnyIfEmpty, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Comment from "./Comment"

import styles from '../styles/modules/commentSection.module.scss'

export default function CommentSection({postId} :any) {

    const { currentUser } = useSelector((state:any) => state.user)
    const [comment, setComment] = useState<string>('')
    const [commentError, setCommentError] = useState<any>(null)
    const [comments, setComments] = useState<any[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [commentToDelete, setCommentToDelete] = useState<any>(null)
    
    const navigate = useNavigate()

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if(res.ok) {
                    const data = await res.json();
                    setComments(data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getComments()
    }, [postId])

    const handleSubmit = async(e:any) => {
        e.preventDefault();
        if(comment.length > 250) {
            return
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id })
            })
            const data = await res.json();
            if(res.ok) {
                setComment('')
                setCommentError(null)
                setComments([data, ...comments]);
            }
        } catch (error: any) {
            setCommentError(error.message)
        }
    }

    const handleLike = async (commentId: any) => {
        try {
            if(!currentUser) {
                navigate('/sign-in')
                return;
            }    
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
              });       
            if(res.ok) {
                const data = await res.json();
                setComments(comments.map((comment) => 
                    comment._id === commentId ? {
                        ...comment, 
                        likes: data.likes,
                        numberOfLikes: data.likes.length,
                    } : comment
                ))
            }
        } catch (error:any) {
            console.log(error.message);
        }
    }

    const handleEdit = async(comment: any, editedContent: string) => {
        setComments(
            comments.map((el) => 
            el._id === comment._id ? {...el, content: editedContent} : el)
        )
    }

    const handleDelete = async(commentId: any) => {
        setShowModal(false)
        try {
            if(!currentUser) {
                navigate('/sign-in')
                return
            }         
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE'
            });
            if(res.ok) {
                const data = await res.json();
                setComments(comments.filter((comment) => comment._id !== commentId));
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        {currentUser ? (
            <div>
                <p>signed in as</p>
                <img src={currentUser.profileImg} alt="" style={{width: '20px', height:'20px'}} />
                <Link to={'/dashboard?tab=profile'}>
                    {currentUser.username}
                </Link>
            </div>
        ) : (
            <div>
                <p><Link to={'/sign-in'}>Войдите</Link> в аккаунт, чтобы оставлять комментарии</p>
            </div>
        )}
        { currentUser && (
            <form onSubmit={handleSubmit}>
                <textarea rows={4} maxLength={250} placeholder="comment..." onChange={(e:any) => setComment(e.target.value)} value={comment} />
                <div>
                    <p>Сиволов осталось: {250 - comment.length}</p>    
                    <button type="submit">Поделиться</button>
                </div> 
                {
                    commentError && 
                    <div>
                        <p>{commentError}</p>
                    </div>
                }   
            </form>
        )}
        {comments.length === 0 ? (
            <p>no coments yet</p>
        ) : (
            <>
            <div>
                <p>Cometns</p>
                <div>
                    <p>{comments.length}</p>
                </div>
            </div>
            {comments.map((comment:any) => (
                <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId: any) => {setShowModal(true);
                    setCommentToDelete(commentId)}} />
            ))}
            </>
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
                        <button onClick={() => handleDelete(commentToDelete)}>
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
