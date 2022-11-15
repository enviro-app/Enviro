import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
  Image,
  Pressable,
  Linking,
} from 'react-native';
import { API_URL } from '../../_config';
import {
  Text,
  Button,
  Card,
  List,
  Divider,
  useTheme,
  TextInput,
  RadioButton,
  ActivityIndicator,
} from 'react-native-paper';
import { storage } from '../../mmkv';
import { Dropdown } from 'react-native-element-dropdown';

const styles = StyleSheet.create({
  view: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
  },
  icon: {
    height: 35,
    width: 50,
  },
  card: {
    marginVertical: 7,
  },
});

export function PayScreen({ navigation, route }) {
  const { title, thumb } = route.params;
  const { colors } = useTheme();
  const [amount, setAmount] = useState({});
  const [selected, setSelected] = useState();
  const [expand, setExpand] = useState();

  const [required, setRequired] = useState();
  const [currency, setCurrency] = useState(0);

  const [cardData, setCardData] = useState({});
  
//  const [log, slog] = useState();
  const [methods, setMethods] = useState(
    JSON.parse(storage.getString('paymentMethods') || '[]'),
  );

  useEffect(() => {
    let request = async () => {
      try {
        let data = await fetch(
          API_URL +
            `/paymentMethods?country=${storage.getString('countryCode')}`,
        );
        data = await data.json();
        storage.set('paymentMethods', JSON.stringify(data.data));
        setMethods(data.data);
      } catch (e) {
        if (e.toString().includes('Network request failed')) {
          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
          navigation.goBack();
          return;
        }
        console.error(e);
      }
    };
    request();
  }, []);

  // get Ewallet providers.
  const ewallets =
    methods?.length != 0 &&
    methods.filter((d) => ['ewallet', 'ewallet_redirect'].includes(d.category));

  const cards = methods && methods.filter((d) => d.category === 'card');
  const banks =
    methods && methods.filter((d) => d.category === 'bank_redirect');

  const currencies = selected?.currencies.map((d, index) => {
    return { label: d, index: index };
  });

  const RenderCards = (item, index) => {
    return (
      <List.Item
        key={index}
        style={{ backgroundColor: colors.background }}
        titleNumberOfLines={2}
        title={item?.name || item?.label}
        right={() =>
          item?.image && (
            <Image
              style={styles.icon}
              source={{ uri: item?.image }}
              resizeMode="contain"
            />
          )
        }
      />
    );
  };

  const RenderWallet = (item, index, allowPress = true) => {
    const onPress = allowPress
      ? async () => await GetRequired(item)
      : undefined;
    return (
      <View key={index}>
        <List.Item
          style={{ backgroundColor: colors.onSecondary }}
          title={item?.name}
          left={() => (
            <RadioButton
              onPress={onPress}
              status={selected?.name == item?.name ? 'checked' : 'unchecked'}
            />
          )}
          right={() => (
            <Image
              style={styles.icon}
              source={{ uri: item?.image }}
              resizeMode="contain"
            />
          )}
          onPress={onPress}
        />
        <Divider />
      </View>
    );
  };

  const GetRequired = async (item) => {
    setSelected(item);
    let data = await (
      await fetch(API_URL + '/getReqFields?type=' + item.type)
    ).json();
    setRequired(data.data);
  };

  return (
    <ScrollView
      style={styles.view}
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <Text>Donating for</Text>
      <Card style={{ marginTop: 4 }} onPress={navigation.goBack}>
        <Card.Title
          title={title}
          titleStyle={{ fontSize: 20 }}
          left={() =>
            thumb && (
              <Image
                source={{ uri: thumb }}
                style={{ height: 50, width: 50, borderRadius: 10 }}
              />
            )
          }
        />
      </Card>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontFamily: 'Karma-Bold',
          marginVertical: 10,
          marginTop: 25,
        }}
      >
        Choose Payment Method
      </Text>
      <Divider />
      {methods?.length == 0 && (
        <ActivityIndicator style={{ paddingTop: 10 }} size={'large'} />
      )}
      {ewallets && (
        <>
          <Card
            style={{
              borderRadius: 10,
              backgroundColor: colors.onSecondary,
              elevation: 2,
            }}
          >
            <List.Accordion
              title="Wallets"
              style={{
                backgroundColor: colors.onSecondary,
                borderRadius: expand === 0 ? 0 : 10,
              }}
              expanded={expand == 0}
              onPress={() => setExpand(expand === 0 ? null : 0)}
            >
              {ewallets?.map(RenderWallet)}
            </List.Accordion>
          </Card>
          {cards.length != 0 && (
            <Card style={{ marginVertical: 10, borderRadius: 10 }}>
              <List.Accordion
                title="Cards"
                style={{
                  backgroundColor: colors.onSecondary,
                  borderRadius: expand === 2 ? 0 : 10,
                  elevation: 2,
                }}
                expanded={expand == 1}
                onPress={() => setExpand(expand == 1 ? null : 1)}
              >
                <View style={{ marginHorizontal: 15, paddingVertical: 18 }}>
                  <Dropdown
                    placeholder="Choose Card Type"
                    renderItem={RenderCards}
                    style={{
                      borderWidth: 0.4,
                      padding: 5,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                    labelField="name"
                    valueField="type"
                    value={selected?.type}
                    renderRightIcon={() =>
                      selected?.category === 'card' && (
                        <Image
                          source={{ uri: selected.image }}
                          style={styles.icon}
                          resizeMode="contain"
                        />
                      )
                    }
                    onChange={GetRequired}
                    data={cards || []}
                  />
                  {selected?.category == 'card' && (
                    <>
                      <TextInput
                        autoFocus
                        mode="outlined"
                        placeholder="Cardholder name"
                        value={cardData?.customer_name}
                        onChangeText={(text) =>
                          setCardData({ ...cardData, customer_name: text })
                        }
                      />
                      <TextInput
                        mode="outlined"
                        placeholder="Card Number."
                        keyboardType="number-pad"
                        style={{ marginBottom: 10 }}
                      />
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={{
                            textAlignVertical: 'center',
                            marginRight: 10,
                          }}
                        >
                          Expiration:
                        </Text>
                        <TextInput
                          keyboardType="number-pad"
                          maxLength={2}
                          mode="outlined"
                          placeholder="Month"
                          value={cardData?.expiration_month || ''}
                          onChangeText={(text) =>
                            setCardData({ ...cardData, expiration_month: text })
                          }
                        />
                        <TextInput
                          style={{ marginLeft: 5 }}
                          keyboardType="number-pad"
                          maxLength={2}
                          mode="outlined"
                          placeholder="Year"
                          value={cardData?.expiration_year || ''}
                          onChangeText={(text) =>
                            setCardData({ ...cardData, expiration_year: text })
                          }
                        />
                        <TextInput
                          mode="outlined"
                          maxLength={3}
                          value={cardData?.cvv}
                          placeholder="CVV"
                          onChangeText={(text) =>
                            setCardData({ ...cardData, cvv: text })
                          }
                          keyboardType="number-pad"
                          style={{
                            flexDirection: 'row',
                            marginLeft: 25,
                            minWidth: 80,
                          }}
                        />
                      </View>
                    </>
                  )}
                </View>
              </List.Accordion>
            </Card>
          )}
          {banks && (
            <Card style={{ borderRadius: 10 }}>
              <List.Accordion
                style={{
                  backgroundColor: colors.onSecondary,
                  borderRadius: expand === 3 ? 0 : 10,
                }}
                title="Banks"
                expanded={expand === 3}
                onPress={() => setExpand(expand === 3 ? null : 3)}
              >
                <Dropdown
                  style={{ padding: 10 }}
                  placeholder="Choose Bank"
                  data={banks}
                  value={selected?.type}
                  search
                  renderItem={(item, index) => RenderWallet(item, index, false)}
                  onChange={GetRequired}
                  labelField="name"
                  valueField="type"
                />
              </List.Accordion>
            </Card>
          )}
        </>
      )}
      {required && selected.category !== 'card' && (
        <>
          {required.fields
            .filter((d) => d.is_required)
            .map((d) => (
              <>
                <View style={{ marginVertical: 8 }}>
                  {d.description && (
                    <Text style={{ marginVertical: 5 }}>{d.description}</Text>
                  )}
                  <TextInput
                    label={d.name}
                    value={cardData[d.name]}
                    onChangeText={(text) => {
                      cardData[d.name] = text;
                      setCardData({ ...cardData });
                    }}
                    mode="outlined"
                  />
                </View>
              </>
            ))}
        </>
      )}
      <List.Item
        title="Amount:"
        right={() => (
          <>
            <TextInput
              style={{ minWidth: 100 }}
              error={amount.error}
              value={amount.value}
              mode="outlined"
              onChangeText={(text) => setAmount({ value: text, error: false })}
              keyboardType={'number-pad'}
            />
            {currencies && (
              <Dropdown
                selectedTextStyle={{ textAlign: 'center' }}
                style={{ minWidth: 80, marginLeft: 5 }}
                data={currencies}
                labelField="label"
                valueField="index"
                value={currency}
                renderItem={RenderCards}
                onChange={(item) => setCurrency(item.index)}
                search={currencies.length > 1}
              />
            )}
          </>
        )}
      />

      <Button
        mode="contained-tonal"
        style={{ marginBottom: 100, marginTop: 5 }}
        onPress={async () => {
          if (!selected) {
            ToastAndroid.show(
              'Select Payment method first.',
              ToastAndroid.SHORT,
            );
            return;
          }
          if (amount?.error || !amount?.value || parseInt(amount.value) < 1) {
            setAmount({ ...amount, error: true });
            ToastAndroid.show('Invalid Amount entered.', ToastAndroid.SHORT);
            return;
          }
          if (!selected.currencies[currency]) {
            ToastAndroid.show('Select Currency.');
            return;
          }
          let _data = selected;

          // Validate Required Fields.
          const allowed = required.fields.map((d) => d.name);
          let cardD = Object.fromEntries(
            Object.entries(cardData).filter((d) => allowed.includes(d[0])),
          );

          let data = {
            amount: amount.value,
            currency: selected.currencies[currency],
            payment_method: {
              type: _data.type,
              fields: cardD,
            },
          };
          let res = await fetch(API_URL + '/call?method=payments&type=post', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          let response = await res.json();
          if (response.data.status === 'ACT') {
            navigation.navigate('PayInstruct', { data: response.data });
          }
        }}
      >
        Proceed
      </Button>
      {/* <Text selectable>
        {JSON.stringify(log, null, 1)}
      </Text> */}
    </ScrollView>
  );
}
