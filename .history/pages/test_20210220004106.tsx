import React from 'react';
import Link from 'next/link';

type User = {
  id?: string;
  name: string;
};

const Index = () => {
  return (
    <div className="container">
      <h1>Pages</h1>
      <ul>
        <Link href="/user/slist">
          <a>user</a>
        </Link>
      </ul>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
