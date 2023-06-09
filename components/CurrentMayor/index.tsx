import { Avatar, Flex, Text, Title } from '@mantine/core';
import { Mayor, User } from '@prisma/client';
import { IconCrown } from '@tabler/icons-react';
import moment from 'moment';

export type ComposedMayor = Mayor & {
  user: User,
}

interface CurrentMomentProps {
  currentMayor: ComposedMayor,
}

export default function CurrentMayor ({currentMayor}: CurrentMomentProps) {
  return (
    <Flex
      mih={50}
      gap='xl'
      justify='flex-start'
      align='center'
      direction='column'
      wrap='wrap'
    >
      <Avatar color='blue' radius='xl' size='lg'>
        <IconCrown size='2rem' />
      </Avatar>
      <Title order={3}>{currentMayor?.user.name}</Title>
      <Text c='#9A9A9A'>
        <Text fw='bold' span c='#343434'>Início do mandato: </Text> 
        {moment(currentMayor?.startOfMandate).format('LL')}
      </Text>
    </Flex>
  )
}