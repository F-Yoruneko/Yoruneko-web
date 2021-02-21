import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Table } from 'react-bootstrap';
import { firestore } from '@/lib/firebase';

interface Subject {
  id: string;
  boring: number;
  credit: number;
  difficult: number;
  easy: number;
  faculty: string;
  interesting: number;
  name: string;
  professor: string;
  term: string;
  university: string;
  url: string;
  channelId: string;
  evaluated: boolean;
}

interface User {
  id?: string;
  name: string;
  email: string;
  university: string;
  subjects: any[];
}

interface mySubjects {
  id?: string;
  name: string;
  interesting: boolean;
  boring: boolean;
  easy: boolean;
  difficult: boolean;
}

const Index = () => {
  // router
  const { query } = useRouter();
  const userId = query.userId;

  // user情報
  const [user, setUser] = useState<User | undefined>();

  //履修情報
  const [mySubjects, setMySubjects] = useState<Subject[]>([]);

  const getSubjects = async () => {
    if (user) {
      console.log(user);
      const subjectList = user.subjects.map((item) => item);
      const subjects = [];
      for (const sub of subjectList) {
        const data = await sub.subject.get();
        subjects.push({
          ...data.data(),
          evaluated: sub.evaluated,
          id: data.id,
        });
      }
      setMySubjects(subjects);
    }
  };

  useEffect(() => {
    getSubjects();
  }, [user]);

  // init ユーザー情報
  useEffect(() => {
    if (userId) {
      firestore.collection('user').onSnapshot((collection) => {
        console.log(userId);
        const data = collection.docs
          // userIdの一致する情報のみにフィルタリング
          .filter((doc) => doc.id === userId)
          .map((doc) => {
            console.log(doc.data());
            return {
              id: doc.id,
              name: doc.data().name || '',
              email: doc.data().email ||  '',
              university: doc.data().university,
              subjects: doc.data().subjects || [],
            };
          });
        // マッチしたものが1件取れればいいので配列の0番目のみ取得
        console.log('init user');
        setUser(data[0]);
      });
    }
  }, [userId]);

  console.log(user);

  useEffect(() => {
    const userRef = firestore.collection('user');
    console.log(userRef);
  });
  console.log(mySubjects);

  // 評価をfirebaseに登録する
  const handleAddEvaluation = async (e) => {

    // firestoreにuserを登録
    const addEvaluationSubjectId = e.target.id;
    const addEvaluationType = e.target.value;
    console.log(addEvaluationSubjectId)
    console.log(addEvaluationType)
    e.target.disabled = true;
    // const subjects = user.data()?.subjects ?? [];
    // const updateSubjects = subjects.map((x) => ({
    //   subject: x.subject,
    //   evaluated: (await x.subject.get()).data().id == addEvaluationSubjectId ? true : false
    // }));
    // firestore.collection('user').doc(userId).update({
    //   subjects: updateSubjects
    // });
    firestore.collection('subject').doc(addEvaluationSubjectId).get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          switch (addEvaluationType) {
            case "easy":
              firestore.collection('subject').doc(addEvaluationSubjectId).update({
                easy: doc.data().easy + 1
              } as mySubjects);
              break;
            case "difficult":
              firestore.collection('subject').doc(addEvaluationSubjectId).update({
                difficult: doc.data().difficult + 1
              } as mySubjects);
              break;
            case "interesting":
              firestore.collection('subject').doc(addEvaluationSubjectId).update({
                interesting: doc.data().interesting + 1
              } as mySubjects);
              break;
            case "boring":
              firestore.collection('subject').doc(addEvaluationSubjectId).update({
                boring: doc.data().boring + 1
              } as mySubjects);
              break;
            default:
              break;
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }
  )}

  const handleClick = async(channelId:string) => {
    try {
      const res = await fetch(`/api/slack/invite?email=${user?.email}&channelId=${channelId}`);
      const data = await res.text();
      alert(data);
      }catch (error) {
        console.log(error)
        alert("ネットワークエラーが発生しました。");
      }
  }

  return (
    <div className="container">
      <h1>{user?.name || ''}のマイページ</h1>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>科目名</th>
            <th>教員</th>
            <th>ターム</th>
            <th>単位数</th>
            <th>Slack</th>
            <th>履修評価</th>
          </tr>
        </thead>
        <tbody>
          {mySubjects.map((mySubject, index) => (
            <tr key={mySubject.id}>
              <td>{index + 1}</td>
              <td>{mySubject.name}</td>
              <td>{mySubject.professor}</td>
              <td>{mySubject.term}</td>
              <td>{mySubject.credit}</td>
              <td><Button onClick={() => handleClick(mySubject.channelId)}>Slackチャンネル参加</Button></td>
              <td>
                <Button
                  id={mySubject.id}
                  value = "easy"
                  className="btn-sm btn-primary inline-block"
                  onClick = {handleAddEvaluation}
                  disabled = {mySubject.evaluated}
                >
                  {' '}
                  楽単だぞ{' '}
                </Button>
                <Button
                  id={mySubject.id}
                  value = "difficult"
                  className="btn-sm btn-primary inline-block"
                  onClick = {handleAddEvaluation}
                  disabled = {mySubject.evaluated}
                >
                  {' '}
                  難しい！{' '}
                </Button>
                <Button
                  id={mySubject.id}
                  value = "interesting"
                  className="btn-sm btn-primary inline-block"
                  onClick = {handleAddEvaluation}
                  disabled = {mySubject.evaluated}
                >
                  {' '}
                  面白い！{' '}
                </Button>
                <Button
                  id={mySubject.id}
                  value = "boring"
                  className="btn-sm btn-primary inline-block"
                  onClick = {handleAddEvaluation}
                  disabled = {mySubject.evaluated}
                >
                  {' '}
                  つまらん{' '}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Link href="/subject">
        <a>科目一覧へ</a>
      </Link>

      <style jsx>{`
        .creaditValue {
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default Index;
