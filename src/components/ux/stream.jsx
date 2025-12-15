import { useEffect, useState, useRef } from "react";
import { getUser } from "@/utils/db";
import SessionCard from "@/components/ux/SessionCard"


export default function Stream({ sessionData, token, userId }) {
  const BATCH_SIZE = 10;

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [items, setItems] = useState(sessionData.slice(0, BATCH_SIZE));
  const loaderRef = useRef(null);
  const [username, setUsername] = useState(null);

  console.log('userId', userId) // get username from userID, pass down to card
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

    console.log('username', username)

return (
    <div className="flex flex-col gap-2 w-full">
      {/* make entire card clickable to view session as post (breakdown) */}

      {items.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          token={token}
          username={username}
        />
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