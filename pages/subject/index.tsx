import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Modal, ArrowRight} from 'react-bootstrap';
import { useRouter } from 'next/router';
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

  const handleFilter  = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const course = event.target.value;
    console.log(course);
    const tempSubjects = subjects.filter(subject => subject.faculty.includes(course));
    setFilteredSubjects(tempSubjects);
  };

  // init
  useEffect(() => {
    const f = async() => {
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
    }
  f();
  }, []);

  console.log(subjects);
  console.log(subjectIds);

  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

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
                  <span className="evaluate"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                    <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                  </svg>   + {subject.interesting}</span>
                  <span className="evaluate"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-hand-thumbs-down" viewBox="0 0 16 16">
                    <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                  </svg>   - {subject.boring} </span>

                  <span className="evaluate"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-emoji-heart-eyes" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434z"/>
                  </svg>   + {subject.easy}  </span>
                  <span className="evaluate"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-emoji-dizzy" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                  </svg>  - {subject.difficult} </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={handleUpdateSubject}>
          登録
        </Button>
      </div>

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

      <style jsx>{``}</style>
    </div>
  );
};

export default Index;
