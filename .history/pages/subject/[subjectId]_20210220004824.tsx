import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { firestore } from '@/lib/firebase';

type Subject = {
  id?: string;
  name: string;
};

const Index = () => {
  // router
  const { query } = useRouter();
  const subjectId = query.subjectId;

  // subject情報
  const [subject, setSubject] = useState<Subject | undefined>();

  // subjectsに変更があるごとに実行される
  useEffect(() => {
    console.log(subject);
  }, [subjectId]);

  // init
  useEffect(() => {
    firestore.collection('subject').onSnapshot((collection) => {
      const data = collection.docs
        // subjectIdの一致する情報のみにフィルタリング
        .filter((doc) => doc.id === subjectId)
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name || '',
        }));
      // マッチしたものが1件取れればいいので配列の0番目のみ取得
      setSubject(data[0]);
    });
  }, []);

  return (
    <div className="container">
      <h1>{subject?.name || ''}</h1>

      <Link href="/subject/slist">
        <a>subject listへ</a>
      </Link>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
