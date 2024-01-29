import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../Components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState<[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('api/post/getposts?limit=12')
      const data = await res.json();
      setPosts(data.posts)
    }
    fetchPosts()
  }, [])
  return (
    <div>
      <div>
        <h1>Добро пожаловать</h1>
        <Link to={'/search'}>Смотреть все</Link>
      </div>
      <div>
        {
          posts && posts.length > 0 && (
            <div>
              <h2>Последние статьи</h2>
              <div>
                {posts.map((post: any) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}
