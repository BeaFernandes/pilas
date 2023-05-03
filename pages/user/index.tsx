import { GetServerSideProps } from 'next'


export default function User() {
  return (
    <div>
      User
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  // get user form nextauth

  return {
    props: {
      
    },
  }
}
