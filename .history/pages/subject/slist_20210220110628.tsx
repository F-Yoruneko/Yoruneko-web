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
    firestore
      .collection('subject')
      .where('university', '==', 'A大学')
      .onSnapshot((collection) => {
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
      <div>
        <table border="1">
          <thead>
            <th>学科</th>
            <th>学部</th>
            <th>科目名</th>
            <th>評価</th>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.faculty}</td>
                <td>{subject.department}</td>
                <td>{subject.name}</td>
                <td>
                  <div>{subject.interesting}</div>
                  <div>{subject.boring}</div>、
                  <div>{subject.easy}</div>
                  <div>{subject.difficult}<>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <input type="text" onChange={handleSubjectNameChange} />


      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
