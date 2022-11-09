/**
 * @file Seasons Page Tab Item - Basic
 *
 * @author seedlessapple <luminousseedlessapple@gmail.com>
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
import Button from "components/button/Button";
import Input from "components/input/Input";
import Select from "components/select/Select";
import useDatabase from "hooks/useDatabase";
import { useState } from "react";
import style from "style/pages/admin/schools.module.scss";

type Props = {
  seasonData: any;
};

function Basic(props: Props) {
  const database = useDatabase();
  const [year, setYear] = useState<number>(parseInt(props.seasonData.year));
  const [term, setTerm] = useState<string>(props.seasonData.term);
  const [seasonStart, setSeasonStart] = useState<string>(
    props.seasonData?.period?.start ?? ""
  );
  const [seasonEnd, setSeasonEnd] = useState<string>(
    props.seasonData?.period?.end ?? ""
  );

  async function updateSeason(data: any) {
    const result = database.U({location:"l",data:""})
  }

  const years = () => {
    let result: { text: string; value: number }[] = [];
    const date = new Date();
    const currentYear = date.getFullYear();

    for (let i = 2000; i < currentYear + 50; i++) {
      result.push({ text: i.toString(), value: i });
    }

    return result;
  };
  return (
    <div>
      <div className={style.popup}>
        <div className={style.row}>
          <Select
            style={{ minHeight: "30px" }}
            label="년도 선택"
            defaultSelectedValue={year}
            required
            options={years()}
            appearence={"flat"}
          />
          <Input
            style={{ maxHeight: "30px" }}
            defaultValue={term}
            appearence="flat"
            label="학기"
            onChange={(e: any) => {
              //   setTermName(e.target.value);
            }}
            required
          />
        </div>
        <div className={style.row}>
          <Input
            style={{ maxHeight: "30px" }}
            appearence="flat"
            label="학기 시작"
            onChange={(e: any) => {
              //   setTermName(e.target.value);
            }}
            required
          />
          <Input
            style={{ maxHeight: "30px" }}
            appearence="flat"
            label="학기 끝"
            onChange={(e: any) => {
              //   setTermName(e.target.value);
            }}
            required
          />
        </div>
        <Button
          type={"ghost"}
          disableOnclick
          onClick={() => {}}
          style={{
            borderRadius: "4px",
            marginTop: "24px",
            height: "32px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
          }}
        >
          저장
        </Button>
      </div>
    </div>
  );
}

export default Basic;
