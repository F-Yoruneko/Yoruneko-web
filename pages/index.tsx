import React, { useEffect, useState } from 'react';
import Router from 'next/router'
import Link from 'next/link';
import { Button, Form } from 'react-bootstrap';

import { firestore } from '@/lib/firebase';

type User = {
    id?: string;
    name: string;
    university: string,
    email: string,
    password: string
};

const Index = () => {
  // userの一覧
  const [users, setUsers] = useState<User[]>();
  // 登録するuser
  const [addUser, setAddUser] = useState<User | undefined>();
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log(event.target.value)

    setAddUser({
      ...addUser,
        [event.target.name] : event.target.value
    } as User);
  };

  // nameを持ったuserオブジェクトをfirebaseに登録する
  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // addUserがundefinedなら処理を抜ける
    if (!addUser) return;
    // firestoreにuserを登録
    firestore.collection('user').add(addUser).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    });
    console.log(addUser)
    Router.push('/subject')

  };

  // init
  useEffect(() => {
    firestore.collection('user').onSnapshot((collection) => {
      const data = collection.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || '',
      }));
    });
  }, []);

  return (
    <div className="container">
      <h1>登録画面</h1>
      <Form onSubmit={handleAddUser} className="text-muted">
        <Form.Group>
          <Form.Label>氏名</Form.Label>
          <Form.Control type="text" placeholder = "田中太郎" name="name" onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type="text" placeholder = "test.test@gmail.com" name="email" onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>大学名</Form.Label>
          <Form.Control type="text" placeholder = "富士通大学" name="university" onChange={handleChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>パスワード</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} />
        </Form.Group>
        <Button variant="outline-primary"  type="submit" value="Submit" className="btn-primary text-white" >
          <Link href="/subject" >
            <a className="text-white">登録</a>
          </Link>
          </Button>
      </Form>
      
      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
