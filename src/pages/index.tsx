import { SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const {user} = useUser();

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image src={user.imageUrl} alt="user image" width={56} height={56} className="rounded-full" />
      <input placeholder="Type some emojis..." className="bg-transparent grow outline-none" />
    </div>
  
  )
}

export default function Home() {
  const { user } = useUser();
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if(!data) return <div>No data</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        {!!user && (
          <div className="border-x border-slate-400 w-full h-full md:max-w-2xl">
            <CreatePostWizard />
            <div className="p-4 flex border-b">
              <h1 className="text-4xl text-white font-bold">
                Welcome, {user?.fullName}!
              </h1>
              <SignOutButton />
            </div>
          </div>
        )}
        <div>
          {data.map(({post, author}) => (
            <div key={post.id} className="flex gap-3">
              <Image src={author?.imageUrl || ""} alt="user image" width={56} height={56} className="rounded-full" />
              <div>
                <h2>{author?.username || ""}</h2>
                <p>{post.content}</p>
              </div>
            </div>
          
          ))}
        </div>
      </main>
    </>
  );
}
