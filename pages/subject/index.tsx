import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Modal, ArrowRight} from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { firestore } from '@/lib/firebase';
import 'whatwg-fetch';

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
  professor: string;
  term: string;
  credit:number;
};

var _ = require('lodash');

const Index = () => {
  const { push } = useRouter();

  // subjectの一覧
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // 登録するsubject
  const [subjectIds, setSubjectIds] = useState<string[]>([]);

  // Filter
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

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
      const updateSubjects = subjectIds.map((x) => (
        firestore.collection('subject').doc(x)
      ));
      var newSubjects = new Set(subjects)
      for(var elem of updateSubjects){
        newSubjects.add(elem);
      }
      await userRef.update({
        subjects: newSubjects
      });
      console.log(updateSubjects);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter  = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const course = event.target.value;
    console.log(course);
    const tempSubjects = subjects.filter(subject => subject.faculty.includes(course));
    setFilteredSubjects(tempSubjects);
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
        setFilteredSubjects(data);
      });
  }, []);

  console.log(subjects);
  console.log(subjectIds);

  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  return (

    <div className="container">
      <h1>科目一覧</h1>
      <Form.Group>
        <Form.Label>学部名 検索</Form.Label>
        <Form.Control type="text" placeholder="学部名を入力してください" onChange={handleFilter}></Form.Control>
      </Form.Group>

      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>学部</th>
              <th>学科</th>
              <th>科目名</th>
              <th>教師</th>
              <th>ターム</th>
              <th>単位数</th>
              <th>評価</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
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
                <td>{subject.professor}</td>
                <td>{subject.term}</td>
                <td>{subject.credit}</td>
                <td>
                  <span className="evaluate"><Button
                  className="btn-sm btn-primary inline-block"
                  disabled = {true}
                >
                  {' '}
                  楽単だぞ{' '}
                </Button> {subject.interesting}</span>
                  <span className="evaluate"><Button
                  className="btn-sm btn-primary inline-block"
                  disabled = {true}
                >
                  {' '}
                  難しい！{' '}
                </Button> {subject.boring} </span>

                  <span className="evaluate"><Button
                  className="btn-sm btn-primary inline-block"
                  disabled = {true}
                >
                  {' '}
                  面白い！{' '}
                </Button> {subject.easy}  </span>
                  <span className="evaluate"><Button
                  className="btn-sm btn-primary inline-block"
                  disabled = {true}
                >
                  {' '}
                  つまらん{' '}
                </Button> {subject.difficult} </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Link href="/user/086Y37hyXB70txgcKaKh">
          <Button variant="primary" onClick={handleUpdateSubject}>
            登録
          </Button>
        </Link>

        <>
          <Modal　size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>CampasHackへようこそ！</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            CampasHackは、大学生の活発なキャンパスライフを応援します。
            <br></br>
            最新の履修情報やコミュニケーションツールを通した交流が可能です。

            <hr></hr>
              👋 Slackのワークスペースに招待しました！
              <br></br>
              以下のリンクから参加してください。
              <br></br>
              <a>https://join.slack.com/t/yoruneko-university/shared_invite/zt-mq6x6vwk-oDtodBiVEWO1BoaodpA8pA</a>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
        
      </div>

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
