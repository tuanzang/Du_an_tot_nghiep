import NotFoundImage from "../assets/image/404-page.gif";

export default function NotFound404() {
  return (
    <div style={{ textAlign: "center" }}>
      <img height={"100%"} src={NotFoundImage} alt="404" />
    </div>
  );
}
