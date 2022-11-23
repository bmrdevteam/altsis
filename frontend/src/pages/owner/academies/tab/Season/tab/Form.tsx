/**
 * @file Seasons Page Tab Item - Form
 *
 * @author jessie129j <jessie129j@gmail.com>
 *
 * -------------------------------------------------------
 *
 * IN PRODUCTION
 *
 * -------------------------------------------------------
 *
 * IN MAINTENANCE
 *
 * -------------------------------------------------------
 *
 * IN DEVELOPMENT
 *
 * -------------------------------------------------------
 *
 * DEPRECATED
 *
 * -------------------------------------------------------
 *
 * NOTES
 *
 * @version 1.0
 *
 */

import React, { useState } from "react";
import useDatabase from "hooks/useDatabase";

import style from "style/pages/admin/schools.module.scss";

// components
import Button from "components/button/Button";
import Table from "components/table/Table";
import ToggleSwitch from "components/toggleSwitch/ToggleSwitch";
import Popup from "components/popup/Popup";
import Select from "components/select/Select";
import Input from "components/input/Input";

type Props = {
  academy: string;
  seasonData: any;
};

/* in progress ... */

const Form = (props: Props) => {
  const database = useDatabase();

  /* additional document list */
  const [registrationList, setRegistrationList] = useState<any>([]);

  /* popup activation */
  const [editPopupActive, setPermissionPopupActive] = useState<boolean>(false);

  /* permission type */
  const [formType, setFormType] = useState<string>("");

  /* document fields */
  const [isTeacherAllowed, setIsTeacherAllowed] = useState<any>(false);
  const [isStudentAllowed, setIsStudentAllowed] = useState<any>(false);
  const [exceptions, setExceptions] = useState<any>([]);

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedIsAllowed, setSelectedIsAllowed] = useState<boolean>(true);

  const parsePermission = (permissions: Array<Array<any>>) => {
    const _exceptions = [];

    for (let i = 0; i < permissions.length; i++) {
      if (permissions[i][0] === "role") {
        if (permissions[i][1] === "teacher") {
          setIsTeacherAllowed(permissions[i][2]);
        } else if (permissions[i][1] === "student") {
          setIsStudentAllowed(permissions[i][2]);
        }
      } else {
        _exceptions.push({
          userId: permissions[i][1],
          allowed: permissions[i][2],
        });
      }
    }

    setExceptions(_exceptions);
  };

  async function updatePermission() {
    const _permissions = [];

    for (let i = 0; i < exceptions.length; i++) {
      _permissions.push([
        "userId",
        exceptions[i]["userId"],
        exceptions[i]["allowed"],
      ]);
    }
    _permissions.push(["role", "teacher", isTeacherAllowed]);
    _permissions.push(["role", "student", isStudentAllowed]);

    const result = await database.U({
      location: `academies/${props.academy}/seasons/${props.seasonData?._id}/permission/${formType}`,
      data: {
        new: _permissions,
      },
    });
    return result;
  }

  async function getRegistrationList() {
    const { documents } = await database.R({
      location: `academies/${props.academy}/registrations?season=${props.seasonData._id}`,
    });

    return documents;
  }

  return (
    <>
      <div className={style.form}>
        <div className={style.item}>
          <div className={style.title}>수업 개설 권한</div>
          <Button
            style={{ marginTop: "12px" }}
            type="ghost"
            onClick={() => {
              parsePermission(props.seasonData.permissionSyllabus);
              setFormType("syllabus");
              getRegistrationList().then((res) => {
                setRegistrationList([
                  {
                    text: "",
                    value: "",
                  },
                  ...res
                    ?.filter((r: any) => {
                      if (!r["userId"]) return false;
                      return true;
                    })
                    .map((r: any) => {
                      return {
                        text: `${r["userName"]}(${r["userId"]})`,
                        value: r["userId"],
                      };
                    }),
                ]);
                setSelectedUserId(
                  registrationList.length !== 0
                    ? registrationList[0]["value"]
                    : ""
                );
                setPermissionPopupActive(true);
              });
            }}
          >
            Syllabus
          </Button>
        </div>
        <div className={style.item}>
          <div className={style.title}>수강신청 권한</div>
          <Button
            style={{ marginTop: "12px" }}
            type="ghost"
            onClick={() => {
              parsePermission(props.seasonData.permissionEnrollment);
              setFormType("enrollment");
              setPermissionPopupActive(true);
            }}
          >
            Enrollment
          </Button>
        </div>
        <div className={style.item}>
          <div className={style.title}>평가 권한</div>
          <Button
            style={{ marginTop: "12px" }}
            type="ghost"
            onClick={() => {
              parsePermission(props.seasonData.permissionEvaluation);
              setFormType("evaluation");
              setPermissionPopupActive(true);
            }}
          >
            Evaluation
          </Button>
        </div>
      </div>
      {editPopupActive && (
        <Popup
          style={{ borderRadius: "4px", maxWidth: "600px", width: "100%" }}
          title={`${
            formType === "syllabus"
              ? "수업 개설"
              : formType === "enrollment"
              ? "수강신청"
              : "평가"
          } 권한 설정`}
          setState={setPermissionPopupActive}
          closeBtn
        >
          <div className={style.popup}>
            <div className={style.title}>역할별 설정</div>
            <div className={style.row}>
              <span>선생님</span>
              <ToggleSwitch
                defaultChecked={isTeacherAllowed}
                onChange={(e: any) => {
                  setIsTeacherAllowed(e.target.checked);
                }}
              />
              <span>학생</span>
              <ToggleSwitch
                defaultChecked={isStudentAllowed}
                onChange={(e: any) => {
                  setIsStudentAllowed(e.target.checked);
                }}
              />
            </div>

            <div className={style.title} style={{ marginTop: "24px" }}>
              예외 추가히기
            </div>

            <div className={style.row}>
              <Select
                style={{ minHeight: "30px" }}
                options={registrationList}
                onChange={(e: any) => {
                  setSelectedUserId(e);
                }}
                appearence={"flat"}
              />
              <Select
                style={{ minHeight: "30px" }}
                options={[
                  { text: "허용", value: 0 },
                  { text: "비허용", value: 1 },
                ]}
                setValue={() => {}}
                appearence={"flat"}
              />
              <Button
                type={"ghost"}
                onClick={() => {
                  if (selectedUserId) {
                    setExceptions([
                      ...exceptions,
                      {
                        userId: selectedUserId,
                        isAllowed: selectedIsAllowed,
                      },
                    ]);
                  }
                }}
                style={{
                  borderRadius: "4px",
                  height: "32px",
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
                }}
              >
                추가
              </Button>
            </div>

            <div className={style.title} style={{ marginTop: "24px" }}>
              예외 설정
            </div>

            <Table
              data={exceptions || []}
              header={[
                {
                  text: "ID",
                  key: "",
                  type: "index",
                  width: "48px",
                  align: "center",
                },
                {
                  text: "사용자 ID",
                  key: "userId",
                  type: "string",
                },
                {
                  text: "허용/비허용",
                  key: "allowed",
                  type: "string",
                  returnFunction: (value: any) => (value ? "허용" : "비허용"),
                },
                {
                  text: "삭제",
                  key: "index",
                  type: "button",
                  onClick: (e: any) => {
                    exceptions.splice(e.target.dataset.rowindex, 1);
                    setExceptions([...exceptions]);
                  },
                  width: "80px",
                  align: "center",
                  textStyle: {
                    padding: "0 10px",
                    border: "var(--border-default)",
                    background: "rgba(255, 200, 200, 0.25)",
                    borderColor: "rgba(255, 200, 200)",
                  },
                },
              ]}
            />
          </div>
          <div className={style.row}>
            <Button
              type={"ghost"}
              style={{
                borderRadius: "4px",
                height: "32px",
                margin: "24px 0",
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
              }}
              onClick={(e: any) => {
                updatePermission()
                  .then((res) => {
                    alert("저장 성공");
                  })
                  .catch(() => {
                    alert("저장 실패");
                  });
              }}
            >
              수정하기
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default Form;
