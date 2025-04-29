"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-green-600 mb-6">購入が完了しました！</h1>
      {sessionId ? (
        <p>セッションID: {sessionId}</p>
      ) : (
        <p>セッション情報が見つかりませんでした。</p>
      )}
    </div>
  );
}
