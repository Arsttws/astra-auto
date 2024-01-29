import { useEffect, useState } from "react"
import moment from 'moment'
import { useSelector } from "react-redux";

import styles from '../styles/modules/comment.module.scss'

export default function Comment({comment, onLike, onEdit, onDelete}: any) {
    const { currentUser } = useSelector((state:any) => state.user)
    
    const [user, setUser] = useState<any>({})
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editedContent, setEditedContent] = useState<string>(comment.content)
    
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json()
                if(res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUser()
    }, [comment])

    const handleEdit = () =>{
        setIsEditing(true)
        setEditedContent(comment.content)
    }
    
    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    content: editedContent
                })
            })

            if(res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent)
            }
        } catch (error) {
            console.log(error);
            setIsEditing(false);
        }
    }

  return (
    <div>
        <div>
            <img src={user.profileImg} alt={user.username} style={{width: '30px'}} />
        </div>
        <div>
            <div>
                <span>{user ? user.username : 'Неизвестный пользователь'}</span>
                <span>{moment(comment.createdAt).fromNow() }</span>
            </div>
            {isEditing ? (
                <>
                    <textarea value={editedContent} onChange={(e: any) => setEditedContent(e.target.value)}></textarea>
                    <div>
                        <button type="button" onClick={handleSave}>Сохранить</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Отменить</button>
                    </div>
                </>
            ) : (
                <>
                <p>{comment.content}</p>
                <div>
                    <button type="button" onClick={() => onLike(comment._id)} className={currentUser && comment.likes.includes(currentUser._id) && styles.activeLike || styles.like}>
                        <img src="" alt="%" />
                    </button>
                    <p>{
                        comment.numberOfLikes   
                    }</p>
                    {
                        currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                            <>
                                <button type="button" onClick={handleEdit}>
                                    Изменить
                                </button>
                                <button type="button" onClick={() => onDelete(comment._id)}>
                                    Удалить
                                </button>
                            </>
                        ) 
                    }
                </div>
                </>
            )}
        </div>
    </div>
  )
}