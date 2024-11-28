import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Hello World</title>
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-blue-600">Hello World</h1>
      </main>
    </>
  );
}
