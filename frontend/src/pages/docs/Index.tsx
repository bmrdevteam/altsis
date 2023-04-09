import Svg from "assets/svg/Svg";
import Autofill from "components/input/Autofill";
import Loading from "components/loading/Loading";
import Popup from "components/popup/Popup";
import Select from "components/select/Select";
import { useAuth } from "contexts/authContext";
import EditorParser from "editor/EditorParser";
import useApi from "hooks/useApi";
import Navbar from "layout/navbar/Navbar";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import style from "style/pages/docs/docs.module.scss";
type Props = {};

function Docs({}: Props) {
  const { RegistrationApi, ArchiveApi, FormApi, EnrollmentApi, DocumentApi } =
    useApi();
  const { currentSchool, currentSeason } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<any>();
  const [printForms, setPrintForms] = useState<any>([]);
  const [DBData, setDBData] = useState<any>();
  /* not users but registrations */
  const [users, setUsers] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>();
  const [choosePopupActive, setChoosePopupActive] = useState<boolean>(false);

  const [evaluationData, setEvaluationData] = useState<any>();

  async function getDBData(rid: string, uid: string) {
    const archive = await ArchiveApi.RArchives({
      registration: rid,
    });

    let processedEvaluationByYear: any = [];

    const enrollments = await EnrollmentApi.REnrollmentWithEvaluations({
      student: uid,
      school: currentSchool.school,
    });

    for (const enrollment of enrollments) {
      const IdByYear = `${enrollment.year}${_.join(enrollment.subject)}`;

      enrollment._subject = {};
      for (
        let idx = 0;
        idx < evaluationData?.subjectlabelsBySeason[enrollment?.season]?.length;
        idx++
      ) {
        enrollment._subject[
          evaluationData?.subjectlabelsBySeason[enrollment?.season][idx]
        ] = enrollment?.subject[idx];
      }

      enrollment._evaluation = {};
      for (const evLabel in enrollment?.evaluation) {
        enrollment._evaluation[`${enrollment.term}/${evLabel}`] =
          enrollment?.evaluation[evLabel];
      }

      const idx = _.findIndex(processedEvaluationByYear, ["id", IdByYear]);
      if (idx === -1) {
        for (const evLabel in enrollment?.evaluation) {
          enrollment._evaluation[`${"연도별"}/${evLabel}`] =
            enrollment?.evaluation[evLabel];
        }

        processedEvaluationByYear.push({
          id: IdByYear,
          학년도: enrollment.year,
          학년: enrollment.studentGrade,
          ...enrollment._subject,
          ...enrollment._evaluation,
          [`${enrollment.term}/단위수`]: enrollment?.point || 0,
        });
      } else {
        Object.assign(processedEvaluationByYear[idx], {
          [`${enrollment.term}/단위수`]:
            (processedEvaluationByYear[idx][`${enrollment.term}/단위수`] || 0) +
            (enrollment?.point || 0),
          ...enrollment?._evaluation,
        });
      }
    }

    return {
      [currentSchool.schoolId]: {
        archive: archive.data,
        evaluation: processedEvaluationByYear,
      },
    };
  }

  const RData = async (school: string) => {
    const [registrations, forms, documentData] = await Promise.all([
      RegistrationApi.RRegistrations({
        school: currentSchool?.school,
        season: currentSeason?._id,
        role: "student",
      }),
      FormApi.RForms({ type: "print" }),

      DocumentApi.RDocumentData({ school: currentSchool?.school }),
    ]);
    const form = await FormApi.RForm(forms[0]._id);
    return { registrations, forms, form, documentData };
  };

  useEffect(() => {
    RData(currentSchool?.school)
      .then(
        (res: {
          registrations: [any];
          forms: [any];
          form: any;
          documentData: any;
        }) => {
          // registrations
          const g: any = _.uniqBy(res.registrations, "grade");
          setGrades(
            g.map((val: any) => {
              return { text: val.grade, value: val.grade };
            })
          );
          setSelectedGrade(g[0]?.grade);
          setUsers(_.sortBy(res.registrations, ["userName"]));

          // forms, form, documentData
          setPrintForms(res.forms);
          setFormData(res.form);
          setEvaluationData(res.documentData.dataEvaluation);
        }
      )
      .then(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className={style.section}>
        {/* <div
            className="btn"
            onClick={() => {
              setChoosePopupActive(true);
            }}
          ></div> */}
        <div className={style.search}>
          <div className={style.label}>학생선택</div>
          <Select
            options={grades}
            onChange={(val: string) => {
              setSelectedGrade(val);
            }}
            style={{ borderRadius: "4px", maxWidth: "120px" }}
          />
          <Select
            style={{ borderRadius: "4px" }}
            options={[
              ...printForms.map((val: any) => {
                return { text: val.title, value: val._id };
              }),
            ]}
            onChange={(val: string) => {
              FormApi.RForm(val).then((res) => {
                setFormData(res);
              });
            }}
          />
          <Autofill
            style={{ borderRadius: "4px" }}
            options={[
              { text: "", value: "" },
              ...users
                ?.filter((val) => val.grade === selectedGrade)
                .map((val) => {
                  return {
                    value: JSON.stringify({
                      rid: val._id,
                      uid: val.user,
                    }),
                    text: `${val.userName} / ${val.userId}`,
                  };
                }),
            ]}
            onChange={(value: string | number) => {
              setLoading(true);
              const { rid, uid } = JSON.parse(`${value}`);
              getDBData(rid, uid).then((res) => {
                setDBData(res);
                setLoading(false);
              });
            }}
            placeholder={"검색"}
          />
          <div
            className="btn"
            onClick={() => {
              window.print();
            }}
          >
            <Svg type={"print"} />
          </div>
        </div>
        {!loading ? (
          <EditorParser
            auth="edit"
            data={formData}
            dbData={DBData}
            type="archive"
          />
        ) : (
          <Loading height={"calc(100vh - 55px)"} />
        )}
      </div>

      {choosePopupActive && (
        <Popup
          setState={setChoosePopupActive}
          title="a"
          closeBtn
          style={{ borderRadius: "4px" }}
        >
          <div></div>
        </Popup>
      )}
    </>
  );
}

export default Docs;
