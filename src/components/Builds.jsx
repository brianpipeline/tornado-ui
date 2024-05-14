import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Builds() {
  const [builds, setBuilds] = useState([]);

  async function pollBuilds() {
    let tag = undefined;
    for (;;) {
      let response;
      try {
        response = await axios.get("https://tornado-api-dev-fyxjwz74fq-uc.a.run.app/pollAllBuilds", {
          headers: tag && { "If-None-Match": tag, Prefer: "wait=90" },
        });
      } catch (e) {
        if (response.status == 304) continue;
        console.log("Request failed: " + e);
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }
      tag = response.data.version;
      setBuilds(response.data.builds);
    }
  }

  useEffect(() => {
    pollBuilds();
  }, []);

  return (
    builds &&
    Object.keys(builds).map((repoName, index) => {
      return (
        <div key={index}>
          <h1>{repoName}</h1>
          <ul>
            {Object.keys(builds[repoName]).map((branchName, index) => {
              return (
                <>
                  <h2>{branchName}</h2>
                    {Object.keys(builds[repoName][branchName]).map((buildId, index) => {
                      return (
                        <li key={index}>
                          <ul>{buildId}</ul>
                          <ul>{builds[repoName][branchName][buildId].startTime}</ul>
                          <ul>{builds[repoName][branchName][buildId].status}</ul>
                        </li>
                      );
                    })}
                </>
              );
            })}
          </ul>
        </div>
      );
    })
  );
}
