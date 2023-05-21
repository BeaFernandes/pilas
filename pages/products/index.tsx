import Head from 'next/head';
import { Box, Button, Checkbox, Group, Table, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function ProductsPage() {
    const form = useForm({
        initialValues: {
          email: '',
          termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
          },
    })
    const elements = [
      { position: 6, mass: 12.011, symbol: 'C', name: 'Carbon' },
      { position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen' },
      { position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium' },
      { position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium' },
      { position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium' },
    ];

    const rows = elements.map((element) => (
      <tr key={element.name}>
        <td>{element.position}</td>
        <td>{element.name}</td>
        <td>{element.symbol}</td>
        <td>{element.mass}</td>
      </tr>
    ));
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <Table>
        <thead>
          <tr>
            <th>Element position</th>
            <th>Element name</th>
            <th>Symbol</th>
            <th>Atomic mass</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
    </Table>
    </>
  );
}