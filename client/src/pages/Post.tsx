import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"

import '../styles/style.scss'
import styles from '../styles/modules/post.module.scss'
import CommentSection from "../Components/CommentSection";
import PostCard from "../Components/PostCard";

export default function Post() {

    const { postSlug } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false)
    const [post, setPost] = useState<any>(null)
    const [recentPosts, setRecentPosts] = useState<any>(null)
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                if(!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                if(res.ok) {
                    setPost(data.posts[0])
                    setError(false)
                    setLoading(false)
                }
            } catch (error) {
                setError(false)
                setLoading(false)
            }
        }
        fetchPost()
    }, [postSlug])

    useEffect(() => {
        try {
            const fetchRecentPost = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`)
                const data = await res.json();
                if(res.ok) {
                    setRecentPosts(data.posts)
                }
            }
        fetchRecentPost()
        } catch (error) {
            console.log(error);
        };
    }, [])
    
    if(loading) return (
        <div className={styles.loader}>
            <span>Loading...</span>
        </div>
    )

  return (
    <main>
        <h1>{post && post.title}</h1>
        <Link to={`/search?category=${post.category}`}>
            {post && post.category}
        </Link>
        <img src={post && post.image} alt={post.title} />
        <div>
            <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
            <span>~ {Number((post.content.length / 1000).toFixed(0)) < 5 ? 'минуты' : 'минут'}</span>
        </div>
        <div dangerouslySetInnerHTML={{__html: post && post.content}} className='post-content'>

        </div>
        <CommentSection postId={post._id} />
        <div>
            <h2>Последние статьи</h2>
            <div>
                {recentPosts && 
                recentPosts.map((post: any) => (
                    <PostCard key={post._id} post={post} />
                ))
                }
            </div>
        </div>
    </main>
  )
}
