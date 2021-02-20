import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Table } from "react-bootstrap";
import { firestore } from '@/lib/firebase';

interface Subject {
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
}

interface User {
  id?: string;
  name: string;
  university: string;
  subjects: any[];
};

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
  const [mySubjects, setMySubjects] = useState<mySubjects[]>([]);

  // //init
  // useEffect(() => {
  //     //creadit情報
  //   firestore.collection('mySubjects').add({
  //     accountId: userId,
  //     name: "線形代数",
  //     value: Number(5),
  //   } as mySubjects);
  //   console.log(mySubjectss)
  // }, [])

  // useEffect(() => {
  //   firestore.collection('mySubjects').onSnapshot((collection) => {
  //     const data = collection.docs
  //       .filter((doc) => doc.data().accountId === userId) 
  //       .map((doc) => ({
  //       id: doc.id,
  //       name: doc.data().name || '',
  //       accountId: doc.data().accountId || '',
  //       value: doc.data().value || ''
  //     }));
  //     setMySubjects(data);
  //   });
  // }, []);

const hoge = {
  boring: 0,
  credit: 1,
  difficult: 0,
  easy: 0,
  faculty: '理工学部',
  interesting: 0,
  name: '微分積分',
  professor: '佐藤明',
  term: '春',
  university: 'A大学',
  url:
    'https://line.me/ti/g2/MbhKvwL0KJnc7WrqAG8Vmw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default',
};

  useEffect(() => {
    // firestore.collection('subject').onSnapshot((collection) => {
      //   const docs = collection.docs.map((doc) => doc);
      
      //   firestore.collection('user').add({
        //     name: "demoName",
        //     university: "demoUniversity",
        //     subjects: docs.map(doc => {subject: doc.ref}),
        //   })
        // });
        
    if (user) {
      console.log(user)
      const subjectList = user?.subjects.map(item => item.subject);
      console.log(subjectList);
      // console.log(subjectList?.map(item => item.get()))
    }
  }, [user]);
  

  // init ユーザー情報
  useEffect(() => {
    if (userId) {
      firestore.collection('user').onSnapshot((collection) => {
        console.log(userId)
        const data = collection.docs
          // userIdの一致する情報のみにフィルタリング
          .filter((doc) => doc.id === userId)
          .map((doc) => {
            console.log(doc.data())
            return {
              id: doc.id,
              name: doc.data().name || '',
              university: doc.data().university,
              subjects: doc.data().subjects || []
            }
          });
        // マッチしたものが1件取れればいいので配列の0番目のみ取得
        console.log("init user")
        setUser(data[0]);
      });
    }
  }, [userId]);

  console.log(user);

  useEffect(() =>  {
    const userRef = firestore.collection("user");
    console.log(userRef);

  })
  console.log(mySubjects);

  // // 評価をfirebaseに登録する
  // const handleAddGood = (e) => {
    
  //   // firestoreにuserを登録
  //   const addGoodmySubjectsId = e.target.id;
  //   console.log(addGoodmySubjectsId)
  //   firestore.collection('mySubjects').doc(addGoodmySubjectsId).get().then(function(doc) {
  //     if (doc.exists) {
  //         console.log("Document data:", doc.data());
  //         firestore.collection('mySubjects').doc(addGoodmySubjectsId).update({
  //           value: doc.data().value + 1
  //         } as mySubjects);
  //     } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //     }
  //   }
  // )}

  return (
    <div className="container">
      
      <h1>{user?.name || ''}の履修履歴</h1>
      <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>科目名</th>
          <th>取得単位数</th>
          <th>slack URL</th>
          <th>履修評価</th>
        </tr>
      </thead>
        <tbody>
          {mySubjects.map((mySubject, index) => (
            <tr>
              <td key={index+1}>
                {index+1}
              </td>
              <td key={mySubject.id}>
                <Link href={`/user/${mySubject.id}`}>
                  <a>{mySubject.name}</a>
                </Link>
              </td>
              <td>
                1.0
              </td> 
              <td>
                https://slack.com
              </td>
              <td>
                <p className="creaditValue" > {mySubject.interesting} </p> <Button id={mySubject.id} className="btn-sm btn-primary inline-block"> いいね </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Link href="/user/list">
        <a>user listへ</a>
      </Link>

      <style jsx>{`
        .creaditValue{
          display: inline-block
        }
      `}</style>
    </div>
  );
};

export default Index;
