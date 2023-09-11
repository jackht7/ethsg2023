import { Button, Grid, Typography } from '@mui/material';

import MainCard from '~/components/MainCard';
import ReportsTable from '../dashboard/ReportsTable';
import Contracts from './Contracts';

// only show recent reports
const Reports = () => {
  const initialValues = {};

  return (
    <>
      <Grid item xs={12} md={10} lg={10}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Contracts</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Contracts />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={10} lg={10} sx={{ marginTop: '30px' }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Recent Reports</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ReportsTable />
        </MainCard>
      </Grid>
    </>
  );
};

export default Reports;
