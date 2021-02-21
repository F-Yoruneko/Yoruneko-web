import { NextApiRequest, NextApiResponse } from 'next';

const token = 'xoxp-1787487955105-1760086730487-1771985010565-9dfa4cc7be38fafaac8bd7bcf42370fa';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.query.email;
  const channelId = req.query.channelId;
  
  console.log(email);
  console.log(channelId);

  try {
    const res1 = await fetch(`https://slack.com/api/users.lookupByEmail?email=${email}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    const user = await res1.json();
    
    const userId = user.user.id
    console.log(userId);
    

    const res2 = await fetch('https://slack.com/api/conversations.invite', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: channelId,
        users: userId,
      })
    });
    
    
    const result = await res2.json();
    console.log(result);
    if(result.ok){
      res.send('招待に成功しました。');
    }
    else if(result.error == 'already_in_channel'){
      res.send('すでに招待済みです。');
    }
    else{
      res.status(401).send('招待に失敗しました。');  
    }

    const res3 = await fetch('https://slack.com/api/conversations.list', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      })
    });
    const result3 = await res3.json();
    console.log(result3)


  } catch (error) {
    console.log(error);
    res.status(500).send('サーバーエラーが発生しました。');
  }
}
