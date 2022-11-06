import { useSession } from "next-auth/react";
export default function Home() {
  const { data } = useSession();
  return (
    <h1
      onClick={async () => {
        fetch("/api/list", { method: "POST" })
          .then((res) => res.json())
          .then((v) => console.log(v));
      }}
    >
      hello
    </h1>
  );
}
