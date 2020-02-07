import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axiosInstance, { AxiosInstance } from '../../helpers/axios';

import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders,
  Card
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  const [coinMeta, setCoinMeta] = useState({ totalTokens: 0, decimals: 0, name: '', symbol: '', tokenBalances: [] });

  useEffect(() => {
    
    axiosInstance.post('', {id: '1', jsonrpc: '2.0', method: 'GetSmartContractInit', params: ['5938fc8af82250ad6cf1da3bb92f4aa005cb2717']})
    .catch((error) => console.log(error))
    .then((response) => {
      setCoinMeta({
        ...coinMeta,
        totalTokens: response.data.result.find(object => object.vname === 'total_tokens').value,
        decimals: response.data.result.find(object => object.vname === 'decimals').value,
        name: response.data.result.find(object => object.vname === 'name').value,
        symbol: response.data.result.find(object => object.vname === 'symbol').value
      })
    });
    
    axiosInstance.post('', {id: '1', jsonrpc: '2.0', method: 'GetSmartContractState', params: ['5938fc8af82250ad6cf1da3bb92f4aa005cb2717']})
    .catch((error) => console.log(error))
    .then((response) => {
      setCoinMeta({
        ...coinMeta,
        tokenBalances: response.data.result.balances
      })
    });
  });

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Card data={{title: "Period", value: "$24,000"}}/>
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalUsers />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TasksProgress />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalProfit />
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestSales />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <UsersByDevice />
        </Grid>
        <Grid
          item
          lg={4}
          md={6}
          xl={3}
          xs={12}
        >
          <LatestProducts />
        </Grid>
        <Grid
          item
          lg={8}
          md={12}
          xl={9}
          xs={12}
        >
          <LatestOrders />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
