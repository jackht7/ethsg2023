import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import Dot from '~/components/@extended/Dot';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  {
    id: 'proposal',
    align: 'left' as const,
    disablePadding: true,
    label: 'Proposal',
  },
  {
    id: 'status',
    align: 'left' as const,
    disablePadding: false,

    label: 'Status',
  },
  {
    id: 'amount',
    align: 'right' as const,
    disablePadding: false,
    label: 'Total Amount',
  },
];

const proposals = [
  {
    proposal: 'Improvement to Kallang River',
    status: 0,
    amount: getRandomInt(500, 20000),
  },
  {
    proposal: 'Office Furniture',
    status: 1,
    amount: getRandomInt(500, 20000),
  },
  {
    proposal: 'Machinery Rental',
    status: 2,
    amount: getRandomInt(500, 20000),
  },
];

const ReportTableHead = ({ order, orderBy }) => {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

ReportTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
};

const OrderStatus = ({ status, tokenId, handleApprove, handleReject }) => {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
      {title == 'Pending' && (
        <>
          <Button
            variant="outlined"
            size="small"
            color="success"
            onClick={() => handleApprove(tokenId)}
          >
            approve
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => handleReject(tokenId)}
          >
            reject
          </Button>
        </>
      )}
    </Stack>
  );
};

OrderStatus.propTypes = {
  status: PropTypes.number,
};

export default function ReportTable(props) {
  const [order] = useState('asc');
  const [orderBy] = useState('trackingNo');
  const [selected] = useState([]);

  const isSelected = (trackingNo) => selected.indexOf(trackingNo) !== -1;

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' },
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          sx={{
            '& .MuiTableCell-root:first-of-type': {
              pl: 2,
            },
            '& .MuiTableCell-root:last-of-type': {
              pr: 3,
            },
          }}
        >
          <ReportTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {/* example */}
            {stableSort(proposals, getComparator(order, orderBy)).map(
              (row, index) => {
                const isItemSelected = isSelected(row.trackingNo);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.proposal}
                    selected={isItemSelected}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      align="left"
                    >
                      <Link color="secondary" component={RouterLink} to="">
                        {row.proposal}
                      </Link>
                    </TableCell>
                    <TableCell align="left">
                      <OrderStatus
                        status={row.status}
                        tokenId={row.proposal}
                        handleApprove={() => {}}
                        handleReject={() => {}}
                      />
                    </TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
