import { isArray } from "lodash";
import React from "react";
import style from "../../editor.module.scss";

type Props = {
  blockData: any;
  auth: "edit" | "view";
  returnData: any;
  defaultValues?: any;
};
const ParsedTableBlock = (props: Props) => {
  const SetColumn = () => {
    const columns = props.blockData?.data?.columns;
    if (columns && isArray(columns)) {
      const columnsSum = columns.reduce((a: number, b: number) => a + b, 0);
      let result = [];
      for (let i = 0; i < columns.length; i++) {
        result.push(
          <col width={`${(100 / columnsSum) * columns[i]}%`} key={i} />
        );
      }
      return <colgroup>{result}</colgroup>;
    }
    return <colgroup></colgroup>;
  };

  const Cell = ({ data }: { data: any }) => {
    switch (data.type) {
      case "paragraph":
        return (
          <div
            className={style.cell}
            style={{ textAlign: data.align, fontSize: data.fontSize }}
          >
            {data.data?.text}
          </div>
        );
      case "input":
        return props.auth === "edit" ? (
          <div
            className={`${style.cell} ${style.input}`}
            style={{ textAlign: data.align }}
            placeholder={data.placeholder ?? "입력"}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              if (data?.name === undefined) {
                props.returnData[data?.id] = e.currentTarget.textContent;
              } else {
                props.returnData[data?.name] = e.currentTarget.textContent;
              }
            }}
          ></div>
        ) : (
          <div>
            <div className={style.cell} style={{ textAlign: data.align }}>
              {data.data?.text}
            </div>
          </div>
        );
      case "select":
        return (
          <div
            className={`${style.cell} ${style.select}`}
            placeholder={data.placeholder ?? "입력"}
          >
            <select
              style={{ textAlign: data.align, fontSize: data.fontSize }}
              onChange={(e) => {
                if (data?.name === undefined) {
                  props.returnData[data?.id] = e.target.value;
                } else {
                  props.returnData[data?.name] = e.target.value;
                }
              }}
            >
              {data.options.map((val: any) => {
                return (
                  <option key={val.id} value={val.value}>
                    {val.text}
                  </option>
                );
              })}
            </select>
          </div>
        );
      case "checkbox":
        return (
          <div className={style.cell} style={{ textAlign: data.align }}>
            <input
              type="checkbox"
              defaultChecked={
                props.defaultValues?.[data?.id] === true ||
                props.defaultValues?.[data?.name] === true
              }
              onChange={(e) => {
                if (data?.name === undefined) {
                  props.returnData[data?.id] = e.target.checked;
                } else {
                  props.returnData[data?.name] = e.target.checked;
                }
              }}
            />
          </div>
        );
      case "timeRange":
        return (
          <div className={style.cell} style={{ textAlign: data.align }}>
            {data.timeRangeStart}
            {" ~ "}
            {data.timeRangeEnd}
          </div>
        );

      default:
        return (
          <div className={style.cell} style={{ textAlign: data.align }}>
            {data.data?.text}
          </div>
        );
    }
  };

  return (
    <div className={style.parsed_block}>
      <table className={style.table}>
        <SetColumn />
        <tbody>
          {props.blockData.data.table.map((value: any[], index: number) => {
            return (
              <tr key={index}>
                {value.map((val, ind: number) => {
                  return val?.isHeader ? (
                    <th
                      key={ind}
                      colSpan={val?.colSpan}
                      rowSpan={val?.rowSpan}
                      style={{ fontSize: val?.fontSize }}
                    >
                      <Cell data={val} />
                    </th>
                  ) : (
                    <td
                      key={ind}
                      colSpan={val?.colSpan}
                      rowSpan={val?.rowSpan}
                      style={{ fontSize: val?.fontSize }}
                    >
                      <Cell data={val} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ParsedTableBlock;
