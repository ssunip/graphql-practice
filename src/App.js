import { graphql } from "@octokit/graphql";
import { useEffect, useState } from "react";
import Discussions from "./Discussions";

async function repo() {
  const { repository, viewer } = await graphql(
    /* 아래는 요청할 쿼리가 들어가는 영역 */
    `
      {
        repository(owner: "codestates-seb", name: "agora-states-fe") {
          discussions(first: 100) {
            edges {
              node {
                id
                title
                createdAt
                url
                author {
                  login
                  avatarUrl
                }
                category {
                  name
                }
                answer {
                  author {
                    login
                  }
                }
              }
            }
          }
        }
        viewer {
          login
          avatarUrl
        }
      }
    `,
    {
      headers: {
        authorization: `token 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`,
      },
    }
  );
  return { repository, viewer };
}

function App() {
  const [repository, setRepository] = useState({});
  const [viewer, setViewer] = useState({});

  const { discussions } = repository;

  // console.log(discussions);
  // console.log(viewer);

  useEffect(() => {
    repo()
      .then((data) => {
        setRepository(data.repository);
        setViewer(data.viewer);
      })
      .catch((error) => {
        console.log(Error, error);
      });
  }, []);

  return (
    <>
      <div className="main">
        <header>
          <h1>My Agora States</h1>
          {viewer !== undefined ? (
            <div className="avatar--wrapper">
              <img src={viewer.avatarUrl} alt={`avatar of ${viewer.login}`} />
              <span>{viewer.login}</span>
            </div>
          ) : null}
        </header>
        <div className="main-wrapper">
          {discussions !== undefined ? (
            <Discussions discussions={discussions} />
          ) : (
            <div>loading...</div>
          )}
        </div>
        <footer>codestates</footer>
      </div>
    </>
  );
}

export default App;
