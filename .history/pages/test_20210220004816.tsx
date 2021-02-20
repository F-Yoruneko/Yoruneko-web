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
        <Link href="/subject/slist">
          <a>subject</a>
        </Link>
      </ul>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
