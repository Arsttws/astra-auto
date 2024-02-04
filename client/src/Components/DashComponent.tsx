import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

import usersImg from "../assets/users.svg";
import postsImg from "../assets/posts.svg";
import commentsImg from "../assets/comments.svg";
import arrow from "../assets/arrow.svg";

import styles from "../styles/modules/dashComponent.module.scss";

export default function DashComponent() {
  const { currentUser } = useSelector((state: any) => state.user);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [lastsMonthUsers, setLastsMonthUsers] = useState<number>(0);
  const [lastsMonthPosts, setLastsMonthPosts] = useState<number>(0);
  const [lastsMonthComments, setLastsMonthComments] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastsMonthUsers(data.lastsMonthUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastsMonthPosts(data.lastsMonthPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastsMonthComments(data.lastsMonthComments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers(), fetchPosts(), fetchComments();
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.shortInfo}>
        <div className={styles.shortInfoBlock}>
          <div className={styles.total}>
            <h3>Всего пользователей</h3>
            <div className={styles.totalAmount}>
              <CountUp end={totalUsers} duration={2} className={styles.count} />
              <Link to={"/dashboard?tab=users"}>
                <img src={usersImg} alt="user" />
              </Link>
            </div>
          </div>
          <div className={styles.lastMonth}>
            <span>
              <CountUp end={lastsMonthUsers || 0} duration={2} />
              <img src={arrow} alt="->" />
            </span>
            <div>
              <p className={styles.lastMonthText}>За прошедший месяц</p>
            </div>
          </div>
        </div>
        <div className={styles.shortInfoBlock}>
          <div className={styles.total}>
            <h3>Всего статей</h3>
            <div className={styles.totalAmount}>
              <CountUp end={totalPosts} duration={2} className={styles.count} />
              <Link to={"/dashboard?tab=posts"}>
                <img src={postsImg} alt="posts" />
              </Link>
            </div>
          </div>
          <div className={styles.lastMonth}>
            <span>
              <CountUp end={lastsMonthPosts || 0} duration={2} />
              <img src={arrow} alt="->" />
            </span>
            <div>
              <p className={styles.lastMonthText}>За прошедший месяц</p>
            </div>
          </div>
        </div>
        <div className={styles.shortInfoBlock}>
          <div className={styles.total}>
            <h3>Всего комментариев</h3>
            <div className={styles.totalAmount}>
              <CountUp
                end={totalComments}
                duration={2}
                className={styles.count}
              />
              <Link to={"/dashboard?tab=comments"}>
                <img src={commentsImg} alt="comment" />
              </Link>
            </div>
          </div>
          <div className={styles.lastMonth}>
            <span>
              <CountUp end={lastsMonthComments || 0} duration={2} />
              <img src={arrow} alt="->" />
            </span>
            <div>
              <p className={styles.lastMonthText}>За прошедший месяц</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recent}>
        <div className={styles.recentUsers}>
          <div className={styles.recentUsersAll}>
            <p>Недавние пользователи</p>
            <Link to={"/dashboard?tab=users"}>Все</Link>
          </div>
          <div className={styles.recentUsersInfo}>
            <div className={styles.recentUsersHeadline}>
              <p>Фото</p>
              <p>Имя пользователя</p>
              <p>Дата регистрации</p>
            </div>
            <span className={styles.line}></span>
            {users &&
              users.map((user) => (
                <div key={user.username} className={styles.singleUser}>
                  <img src={user.profileImg} alt="user"></img>
                  <p>{user.username}</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            <span className={styles.line}></span>

            <Link to={"/dashboard?tab=users"} className={styles.seeAll}>
              Ещё
            </Link>
          </div>
        </div>

        <div className={styles.recentPosts}>
          <div className={styles.recentPostsAll}>
            <p>Недавние статьи</p>
            <Link to={"/dashboard?tab=posts"}>Все</Link>
          </div>
          <div className={styles.recentPostsInfo}>
            <div className={styles.recentPostsHeadline}>
              <p>Фото</p>
              <p>Название</p>
              <p>Категория</p>
            </div>
            <span className={styles.line}></span>
            {posts &&
              posts.map((post) => (
                <div key={post.title} className={styles.singlePost}>
                  <img src={post.image} alt="post"></img>
                  <p>{post.title.substring(0, 50)}...</p>
                  <p>{post.category}</p>
                </div>
              ))}
            <span className={styles.line}></span>

            <Link to={"/dashboard?tab=posts"} className={styles.seeAll}>
              Ещё
            </Link>
          </div>
        </div>

        <div className={styles.recentComments}>
          <div className={styles.recentCommentsAll}>
            <p>Недавние комменитарии</p>
            <Link to={"/dashboard?tab=comments"}>Все</Link>
          </div>
          <div className={styles.recentCommentsInfo}>
            <div className={styles.recentCommentsHeadline}>
              <p>Комментарий</p>
              <p>Понравилось</p>
            </div>
            <span className={styles.line}></span>
            {comments &&
              comments.map((comment) => (
                <div key={comment._id} className={styles.singleComment}>
                  <p>{comment.content}</p>
                  <p>{comment.numberOfLikes}</p>
                </div>
              ))}
            <span className={styles.line}></span>

            <Link to={"/dashboard?tab=comments"} className={styles.seeAll}>
              Ещё
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
