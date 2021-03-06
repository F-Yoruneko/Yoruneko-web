import React, { useEffect, useState } from 'react';
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
  // subjectの一覧
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // 登録するsubject
  const [addSubject, setAddSubject] = useState<Subject | undefined>();

  const handleSubjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    const name = event.target.value;
    setAddSubject({
      name: name,
    } as Subject);
  };

  // nameを持ったsubjectオブジェクトをfirebaseに登録する
  const handleAddSubject = () => {
    // addSubjectがundefinedなら処理を抜ける
    if (!addSubject) return;

    // firestoreにsubjectを登録
    firestore.collection('subject').add({
      name: addSubject.name,
    } as Subject);
  };

  // subjectsに変更があるごとに実行される
  useEffect(() => {
    console.log(subjects);
  }, [subjects]);

  // init
  useEffect(() => {
    firestore.collection('subject').onSnapshot((collection) => {
      const data = collection.docs.map((doc) => ({
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
      setSubjects(data);
    });
  }, []);

  return (
    <div className="container">
      <h1>subject list</h1>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            <Link href={`/subject/${subject.id}`}>
              <a>{subject.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <table border="1">
        <tr>
          <th>科目名</th>
          <th>学部</th>
        </tr>
        <tr>
          {subjects.map((subject) => (
            <td>{subject.name}</td>
            <td>{subject.name}</td>
          ))}
        </tr>
      </table>

      <input type="text" onChange={handleSubjectNameChange} />

      <button onClick={handleAddSubject}>add subject</button>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
