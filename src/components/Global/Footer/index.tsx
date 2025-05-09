import "@/styles/Global/footer.css";

export default function Footer() {
  return (
    <footer className="simple-footer h-[3rem]">
      <p>版權所有 &copy; {new Date().getFullYear()} 臺中市私立明道高級中學</p>
    </footer>
  );
}
