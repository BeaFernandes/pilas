import Layout from '@/components/Layout'
import { Flex, Text, Title } from '@mantine/core'
import Link from 'next/link'

const Fallback = () => (
  <Layout title='Pilas | Offline' activeLink=''>
    <Flex
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
      h='100%'
    >
      <Title order={2} c='#112C55' align='center'>Parece que você está offline</Title>
      <Link href='/' style={{ color: '#343434' }}>
        <Text align='center'>Tente novamente</Text>
      </Link>
    </Flex>
  </Layout>
)

export default Fallback