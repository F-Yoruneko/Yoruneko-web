import React from 'react';
import Link from 'next/link';

type User = {
  id?: string;
  name: string;
};

const Index = () => {
  return (
    <div className="container">
      <Link href="/form/register">
        <h1>Pages</h1>
      </Link>

      <ul>
        <Link href="/user/list">
          <a>user</a>
        </Link>
      </ul>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
