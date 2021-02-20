import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { firestore } from '@/lib/firebase';

type Subject = {
  id?: string;
  university: string;
  name: string;
  faculty: string;
  department: string;
  url: string;
  interesting: number;
  boring: number;
  easy: number;
  difficult: number;
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
          university: doc.data().university || '',
          faculty: doc.data().faculty || '',
          department: doc.data().department || '',
          url: doc.data().url || '',
          interesting: doc.data().interesting || '',
          boring: doc.data().boring || '',
          easy: doc.data().easy || '',
          difficult: doc.data().difficult || '',
        }));
      // マッチしたものが1件取れればいいので配列の0番目のみ取得
      setSubject(data[0]);
    });
  }, []);

  return (
    <div className="container">
      <h1>{subject?.name || ''}</h1>
      <h1>{subject?.faculty || ''}</h1>

      <Link href="/subject/slist">
        <a>subject listへ</a>
      </Link>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
