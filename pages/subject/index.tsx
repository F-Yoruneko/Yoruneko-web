import React, { useEffect, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

import { firestore } from '@/lib/firebase';

const userId = '086Y37hyXB70txgcKaKh';

type Subject = {
  id: string;
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
  const { push } = useRouter();

  // subjectの一覧
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // 登録するsubject
  const [subjectIds, setSubjectIds] = useState<string[]>([]);

  const handleCheck = (subjectId: string) => {
    const newSubjectIds = subjectIds.includes(subjectId)
      ? subjectIds.filter((x) => x !== subjectId)
      : [...subjectIds, subjectId];
    setSubjectIds(newSubjectIds);
  };

  // nameを持ったsubjectオブジェクトをfirebaseに登録する
  const handleUpdateSubject = async () => {
    try {
      const userRef = firestore.collection('user').doc(userId);
      const user = await userRef.get();
      const subjects = user.data()?.subjects ?? [];
      const updateSubjects = subjectIds.map((x) => ({
        evaluation:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          subjects.find((y) => y.subject.id === x)?.evaluation ?? null,
        subject: firestore.collection('subject').doc(x),
      }));
      await userRef.update({
        subjects: updateSubjects,
      });
      // TODO : マイページに遷移
      push('/');
    } catch (error) {
      console.log(error);
    }
  };

  // init
  useEffect(() => {
    firestore
      .collection('subject')
      .where('university', '==', 'A大学')
      .onSnapshot((collection) => {
        const data = collection.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            ...docData,
          } as Subject;
        });
        setSubjects(data);
      });
  }, []);

  console.log(subjects);
  console.log(subjectIds);

  return (
    <div className="container">
      <h1>subject list</h1>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>学科</th>
              <th>学部</th>
              <th>科目名</th>
              <th>評価</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    id={subject.id}
                    value={subject.id}
                    checked={subjectIds.includes(subject.id)}
                    onChange={(e) => handleCheck(e.target.value)}
                  />
                </td>
                <td>{subject.faculty}</td>
                <td>{subject.department}</td>
                <td>{subject.name}</td>
                <td>
                  <div>{subject.interesting}</div>
                  <div>{subject.boring}</div>
                  <div>{subject.easy}</div>
                  <div>{subject.difficult}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={handleUpdateSubject}>
          登録
        </Button>
      </div>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
