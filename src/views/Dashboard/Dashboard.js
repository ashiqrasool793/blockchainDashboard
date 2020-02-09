import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import axiosInstance, { AxiosInstance } from '../../helpers/axios';
import SearchIcon from '@material-ui/icons/Search';
import {
  ButtonGroup,
  CircularProgress,
  InputBase,
  IconButton,
  Paper,
  Tabs,
  Tab
} from '@material-ui/core';

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
import { ReportBase } from 'istanbul-lib-report';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  input: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0)
  },
  loader: {
    marginLeft:'50%',
    paddingBottom: theme.spacing(0)
  }
}));


const Dashboard = () => {
  const classes = useStyles();

  const [address, setAddress] = useState(['5938fc8af82250ad6cf1da3bb92f4aa005cb2717', 'acfbdcf4693b1780e474116211f7f4795f24e06a'])

  const [value, setValue] = React.useState(0);

  const [searchVal, setSearchVal] = React.useState('');

  const [error, setError] = React.useState(false);

  const [loading, setLoading] = React.useState(false);


  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchVal('');
    fetchDetails(address[newValue]);
  };

  const handleSearch = (event, newValue) => {
    setValue(3);
    setSearchVal(event.target.value);
  };

  const [coinMeta, setCoinMeta] = useState({ totalTokens: 0, decimals: 0, name: '', symbol: '', tokenBalances: [] });

  const [tokenBalances, setTokenBalances] = useState({ tokenBalances: [] });
  const fetchTokenDetails = (inputAddress) => {
    console.log("INP" + inputAddress)
    axiosInstance.post('', { id: '1', jsonrpc: '2.0', method: 'GetSmartContractInit', params: [inputAddress] })
      .catch((error) => console.log(error))
      .then((response) => {
        console.log(response)
        if (response.data.error) {
          setLoading(false)
          setError(true)
        }
        else {
          setLoading(false)
          setError(false)
          setCoinMeta({
            ...coinMeta,
            totalTokens: response.data.result.find(object => object.vname === 'total_tokens').value,
            decimals: response.data.result.find(object => object.vname === 'decimals').value,
            name: response.data.result.find(object => object.vname === 'name').value,
            symbol: response.data.result.find(object => object.vname === 'symbol').value
          })
        }
      });
  }

  const fetchTokenBalance = (inputAddress) => {
    axiosInstance.post('', { id: '1', jsonrpc: '2.0', method: 'GetSmartContractState', params: [inputAddress] })
      .catch((error) => console.log(error))
      .then((response) => {
        console.log(response)
        if (response.data.error) {
          setLoading(false)
          setError(true)
        }
        else {
          setLoading(false)
          setError(false)
          setTokenBalances({
            tokenBalances: response.data.result.balances
          })
        }
      });
  }

  const fetchDetails = (inputAddress) => {
    //setAddress(address1)
    setSearchVal('');
    setLoading(true)
    fetchTokenDetails(inputAddress)
    fetchTokenBalance(inputAddress)
  }

  useEffect(() => {
    setLoading(true)
    fetchTokenDetails(address[value])
    fetchTokenBalance(address[value])
  }, []);

  //console.log("DATA" + JSON.stringify(coinMeta.tokenBalances))

  return (
    <div>
      <div className={classes.root}>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            lg={12}
            md={12}
            xl={9}
            xs={12}
          >
            <Paper component="form" className={classes.root}>
              <InputBase
                className={classes.input}
                value={searchVal}
                onChange={handleSearch}
                placeholder="Search For Tokens"
                inputProps={{ 'aria-label': 'search google maps' }}
              />
              <IconButton onClick={() => fetchDetails(searchVal)} className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Alice Coin" />
                <Tab label="Bob Coin" />
              </Tabs>
            </Paper>
          </Grid>
          {loading ? 
          <Grid
          item
          lg={12}
          md={12}
          xl={9}
          xs={12}
        >
          <CircularProgress                 className={classes.loader}
color="primary" /> 
          </Grid>
          : !error ? 
          <React.Fragment>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Card data={{ title: "Coin Name", value: coinMeta.name }} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Card data={{ title: "Decimals", value: coinMeta.decimals }} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Card data={{ title: "Total Tokens", value: coinMeta.totalTokens }} />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Card data={{ title: "Symbol", value: coinMeta.symbol }} />
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xl={9}
            xs={12}
          >
            <LatestOrders value={Object.values(tokenBalances.tokenBalances)} keysToken={Object.keys(tokenBalances.tokenBalances)} />
          </Grid>
          </React.Fragment>
          :
          <Grid
          item
          lg={12}
          md={12}
          xl={9}
          xs={12}
        >
                    <Card data={{ title: "", value: "Sorry! No Token Found for that address" }} />
        </Grid>         
       }
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
