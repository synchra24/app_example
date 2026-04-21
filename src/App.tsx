import { useEffect, useState } from "react";
import "./App.css";
import { SynchraApp, type SynchraThemeColors } from "@synchra24/app";

const synchraApp = new SynchraApp(
  "s24svc_a2uv1AACg7qdGmIVGxcRtJyAFtHIa9ySLhoh24DswjY"
);

const defaultTheme = synchraApp.getSynchraTheme();

function App() {
  const [theme, setTheme] = useState<SynchraThemeColors | undefined>(defaultTheme?.current);
  const [value, setValue] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [hasIntegrated, setHasIntegrated] = useState(false);


  useEffect(() => {
    (async function () {
      const integrated = await synchraApp.isSynchraIntegrated();
      setHasIntegrated(integrated);
    })();

    const unsubscribe = synchraApp.onSynchraThemeChange((theme) => {
      setTheme(theme.current)
    });
    return () => {
      unsubscribe();
    }
  }, []);

  const handleTestButton = async () => {
    const response = await synchraApp.selectUsers({
      users: [25],
      all_users: true,
    });
    setValue(`users_ids: ${response.users.join(",")}`);
  };

  const handleCamera = async () => {
    const photo = await synchraApp.takePhoto({
      use_front_camera: false,
      upload: false,
    });

    setImage("data:image/jpeg;base64," + photo.base64);
  };

  const handleOpenQr = async () => {
    const res = await synchraApp.scanQr();
    setValue(res.value);
  };

  const handleSnackBar = async () => {
    synchraApp.showSnackbar({
      message: "Im working",
      type: "success",
      timeout: 4000,
    });
  };

  const handleOpenModal = async () => {
    const result = await synchraApp.openModal({
      title: "Подтверждение",
      text: "Вы точно хотите продолжить?",
      primary_button_text: "Продолжить",
      secondary_button_text: "Отмена",
    });

    if (result.action === "primary") {
      setValue("Нажато: Продолжить");
    }

    if (result.action === "secondary") {
      setValue("Нажато: Отмена");
    }

    if (result.action === "dismiss") {
      setValue("Закрыто по клику на фон");
    }
  };

  const handleRequestApi = async () => {
    const provider = await synchraApp.getProviderContext();
    const data = await synchraApp.requestApi({
      method: "GET",
      path: `providers/lite/user/${provider.user_id}`,
    });
    setValue(`Привет, ${data.result.first_name} ${data.result.last_name}`);
  };

  const handlePicPhoto = async () => {
    const photo = await synchraApp.pickPhoto({
      upload: false,
    });

    setImage("data:image/jpeg;base64," + photo.base64);
  };

  const handlePickFile = async () => {
    const file = await synchraApp.pickFile({
      upload: false,
    });

    setValue(`name: ${file.name}\nsize: ${file.size}`);
  };

  const handleDateRange = async () => {
    const range = await synchraApp.selectDateRange({});

    setValue(`${range.start_date} - ${range.end_date}`);
  };

  const handleSingleDate = async () => {
    const range = await synchraApp.selectDate({});

    setValue(`${range.date}`);
  };

  const handleSelectTime = async () => {
    const time = await synchraApp.selectTime({
      time: "09:30",
    });

    setValue(`${time.time}`);
  };

  const handleGeo = async () => {
    const position = await synchraApp.getGeoPosition();
    setValue(`${position.latitude}, ${position.longitude}`);
  };

  const handleOpenContacts = async () => {
      await synchraApp.navigate({
        action: "navigate",
        screen: "ContactsUsers",
      });
  }

  if (!hasIntegrated) {
    return (
      <section id="center">
        <h2>App not integrated to Synchra24.</h2>
      </section>
    );
  }

  const styles = {
    root: { backgroundColor: theme?.primary, color: theme?.text },
    button: {
      color: theme?.buttonText,
      backgroundColor: theme?.button,
      borderRadius: 100,
      padding: '4px 12px',
      borderWidth: 0
    },
    textarea: { width: "100%", height: 100, borderRadius: 20, padding: 12, backgroundColor: theme?.inputGrey, color: theme?.text },
    image: { borderRadius: 20 }
  }

  return (
    <section style={styles.root} id="center">
      <h2>Hallo, I'm Synchra.24 application.</h2>
      <div style={{ flexDirection: "row" }}>
        <button style={styles.button} onClick={handleRequestApi}>API Request</button>
        <button style={styles.button} onClick={handleGeo}>Geo position</button>
        <button style={styles.button} onClick={handleTestButton}>Users select</button>
        <button style={styles.button} onClick={handleCamera}>Camera photo</button>
        <button style={styles.button} onClick={handleOpenQr}>QR-scan</button>
        <button style={styles.button} onClick={handleSnackBar}>Snackbar</button>
        <button style={styles.button} onClick={handleDateRange}>Date range</button>
        <button style={styles.button} onClick={handleSingleDate}>Date single</button>
        <button style={styles.button} onClick={handleSelectTime}>Select time</button>
        <button style={styles.button} onClick={handleOpenModal}>Modal dialog</button>
        <button style={styles.button} onClick={handlePicPhoto}>Upload photo</button>
        <button style={styles.button} onClick={handlePickFile}>Upload file</button>
        <button style={styles.button} onClick={handleOpenContacts}>Open contacts</button>
      </div>
      <textarea
        placeholder="Press to command button..."
        value={value}
        style={styles.textarea}
      ></textarea>
      {image && (
        <img
          style={styles.image}
          width={100}
          height={100}
          src={image}
          alt="test"
        />
      )}
    </section>
  );
}

export default App;
