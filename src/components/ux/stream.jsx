import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getUser } from "@/utils/db";
import SessionCard from "@/components/ux/sessions/SessionCard"


export default function Stream({ sessionData, token, userId }) {
  const BATCH_SIZE = 10;

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [items, setItems] = useState(sessionData.slice(0, BATCH_SIZE));
  const loaderRef = useRef(null);
  const [username, setUsername] = useState(null);

  const router = useRouter();

  const handleClick = () => {
    sessionStorage.setItem('sessionReturnPath', router.asPath)
  };

  // console.log('userId', userId) // get username from userID, pass down to card
  // -------------------------------------------
  // Infinite scroll lazy loading
  // -------------------------------------------
  useEffect(() => {
    async function loadUsername() {
      if (!userId) return;

      try {
        const un = await getUser(userId, token);
        setUsername(un.username || "");
      } catch (err) {
        console.error("Error loading usename:", err);
      }
    }

    loadUsername();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const nextCount = visibleCount + BATCH_SIZE;
          setVisibleCount(nextCount);
          setItems(sessionData.slice(0, nextCount));
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [visibleCount, sessionData]);

    // console.log('username', username)

{/* <button
  className="flex items-center gap-1 hover:text-stone-300 transition"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
  }}
>
  <Heart className="h-5 w-5" />
</button>
This is exactly how Instagram-style cards work. */}

return (
    <div className="flex flex-col gap-2 w-full">
    {items.map((session) => (
      <Link
        key={session.id}
        href={`/sessions/${session.id}`}
        onClick={handleClick}
        className="block"
      >
        <SessionCard
          session={session}
          token={token}
          username={username}
        />
      </Link>
    ))}

      <div
        ref={loaderRef}
        className="h-10 flex justify-center items-center text-stone-500"
      >
        Loading more…
      </div>
    </div>
  );
}