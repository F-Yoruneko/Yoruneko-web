import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { firestore } from '@/lib/firebase';

type User = {
  id?: string;
  name: string;
};

const Index = () => {
  // userの一覧
  const [users, setUsers] = useState<User[]>([]);
  // 登録するuser
  const [addUser, setAddUser] = useState<User | undefined>();

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const name = event.target.value;
    setAddUser({
      name: name,
    } as User);
  };

  // nameを持ったuserオブジェクトをfirebaseに登録する
  const handleAddUser = () => {
    // addUserがundefinedなら処理を抜ける
    if (!addUser) return;

    // firestoreにuserを登録
    firestore.collection('user').add({
      name: addUser.name,
    } as User);
  };

  // usersに変更があるごとに実行される
  useEffect(() => {
    console.log(users);
  }, [users]);

  // init
  useEffect(() => {
    firestore.collection('user').onSnapshot((collection) => {
      const data = collection.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || '',
      }));
      setUsers(data);
    });
  }, []);

  return (
    <div className="container">
      <h1>user list</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/user/${user.id}`}>
              <a>{user.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <input type="text" onChange={handleUserNameChange} />

      <button onClick={handleAddUser}>add user</button>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
