import moment from "moment";

export default function ConvertTime(date_input: string) {
  return moment(date_input).format("llll");
}
