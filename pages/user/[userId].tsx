import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { firestore } from '@/lib/firebase';

type User = {
  id?: string;
  name: string;
};

const Index = () => {
  // router
  const { query } = useRouter();
  const userId = query.userId;

  // user情報
  const [user, setUser] = useState<User | undefined>();

  // usersに変更があるごとに実行される
  useEffect(() => {
    console.log(user);
  }, [userId]);

  // init
  useEffect(() => {
    firestore.collection('user').onSnapshot((collection) => {
      const data = collection.docs
        // userIdの一致する情報のみにフィルタリング
        .filter((doc) => doc.id === userId)
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name || '',
        }));
      // マッチしたものが1件取れればいいので配列の0番目のみ取得
      setUser(data[0]);
    });
  }, []);

  return (
    <div className="container">
      <h1>{user?.name || ''}</h1>

      <Link href="/user/list">
        <a>user listへ</a>
      </Link>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
