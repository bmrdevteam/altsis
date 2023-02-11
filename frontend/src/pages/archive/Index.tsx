import Loading from "components/loading/Loading";
import { useAuth } from "contexts/authContext";
import EditorParser from "editor/EditorParser";
import useDatabase from "hooks/useDatabase";
import Navbar from "layout/navbar/Navbar";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "style/pages/archive.module.scss";
type Props = {};

const Archive = (props: Props) => {
  // const database = useDatabase();
  const navigate = useNavigate();
  const { currentSchool } = useAuth();
  useEffect(() => {
    navigate(currentSchool.formArchive[0].label);
  }, []);

  // const [loading, setLoading] = useState<boolean>(true);
  // const [formData, setFormData] = useState<any>();
  // const [DBData, setDBData] = useState<any>();

  // async function getPrintForms() {
  //   const { forms: result } = await database.R({ location: "forms" });
  //   return result;
  // }

  // async function getDBData() {
  //   const archive = await database.R({
  //     location: `archives?school=${currentSchool.school}&userId=${191025}`,
  //   });
  //   let processedEvaluation: any[] = [];
  //   let processedEvaluationByYear: any = [];
  //   const { enrollments: evaluations } = await database.R({
  //     location: `enrollments/evaluations?studentId=${191025}&school=${
  //       currentSchool.school
  //     }`,
  //   });

  //   for (let i = 0; i < evaluations.length; i++) {
  //     const evaluation = evaluations[i];
  //     const Id = `${evaluation.season}${evaluation.subject[0]}${evaluation.subject[1]}`;
  //     const IdByYear = `${evaluation.year}${evaluation.subject[0]}${evaluation.subject[1]}`;

  //     if (_.findIndex(processedEvaluation, ["id", Id]) === -1) {
  //       processedEvaluation.push({
  //         id: Id,
  //         교과: evaluation?.subject[0],
  //         과목: evaluation?.subject[1],
  //         단위수: evaluation?.point,
  //         "멘토 평가": evaluation.evaluation["멘토평가"],
  //         "자기 평가": evaluation.evaluation["자기평가"],
  //         점수: evaluation.evaluation["점수"],
  //         평가: evaluation.evaluation["평가"],
  //         년도: evaluation.year,
  //         학기: evaluation.term,
  //       });
  //     } else {
  //       processedEvaluation[
  //         _.findIndex(processedEvaluation, ["id", Id])
  //       ].단위수 += evaluation.point;
  //     }
  //     if (_.findIndex(processedEvaluationByYear, ["id", IdByYear]) === -1) {
  //       processedEvaluationByYear.push({
  //         id: IdByYear,
  //         학년: evaluation.studentGrade,
  //         년도: evaluation.year,
  //         교과: evaluation?.subject[0],
  //         과목: evaluation?.subject[1],
  //         //만약 1년 단위로 합치고있다면-...-
  //         "세부능력 및 특기사항": evaluation.evaluation["멘토평가"],
  //         [`${evaluation.term}/단위수`]: evaluation?.point,
  //         [`${evaluation.term}/멘토 평가`]: evaluation.evaluation["멘토평가"],
  //         [`${evaluation.term}/점수`]: evaluation.evaluation["점수"],
  //         [`${evaluation.term}/평가`]: evaluation.evaluation["평가"],
  //       });
  //     } else {
  //       Object.assign(
  //         processedEvaluationByYear[
  //           _.findIndex(processedEvaluationByYear, ["id", IdByYear])
  //         ],
  //         {
  //           [`${evaluation.term}/단위수`]:
  //             evaluation?.point +
  //             parseInt(
  //               _.find(processedEvaluationByYear, ["id", IdByYear])[
  //                 `${evaluation.term}/단위수`
  //               ] || 0
  //             ),
  //           [`${evaluation.term}/멘토 평가`]: evaluation.evaluation["멘토평가"],
  //           [`${evaluation.term}/점수`]: evaluation.evaluation["점수"],
  //           [`${evaluation.term}/평가`]: evaluation.evaluation["평가"],
  //         }
  //       );
  //     }
  //   }
  //   return {
  //     [currentSchool.schoolId]: {
  //       archive: archive.data,
  //       evaluation: processedEvaluationByYear,
  //     },
  //   };
  // }

  // async function getFormData(id: string) {
  //   // const { forms: result } = await database.R({ location: `forms/${id}` });
  //   const result = await database.R({
  //     location: `forms/637f8ec0a7b07cb7f3a27da5`,
  //   });
  //   return result;
  // }
  // useEffect(() => {
  //   getPrintForms().then((res) => {
  //     // console.log(res);
  //   });
  //   getFormData("").then((res) => {
  //     setFormData(res);
  //   });
  //   getDBData().then((res) => {
  //     setDBData(res);
  //     setLoading(false);
  //   });
  // }, []);

  return (
    <>
      {/* <Navbar />
      {!loading ? (
        <div className={style.section}>
          <EditorParser auth="edit" data={formData} dbData={DBData} />
        </div>
      ) : (
        <Loading height={"calc(100vh - 55px)"} />
      )} */}
    </>
  );
};

export default Archive;
