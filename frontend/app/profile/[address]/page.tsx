// TODO: Day 23 — Public Profile page
export default function Profile({ params }: { params: { address: string } }) {
  return <main>Profile {params.address}</main>;
}
