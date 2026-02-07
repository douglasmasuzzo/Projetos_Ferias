import streamlit as st
import pandas as pd
import mysql.connector
from dotenv import load_dotenv
import os

# ===============================
# Configuração inicial
# ===============================
st.set_page_config(
    page_title="Monitoramento de Bateria",
    layout="wide"
)

st.title("🔋 Dashboard de Monitoramento da Bateria")

# ===============================
# Conexão com MySQL
# ===============================
load_dotenv()

def conectar_mysql():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", 3306))
    )

# ===============================
# Carregamento dos dados
# ===============================
@st.cache_data(ttl=60)
def carregar_dados():
    conn = conectar_mysql()
    query = """
        SELECT
            timestamp,
            percent,
            plugged
        FROM bateria
        ORDER BY timestamp
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df

df = carregar_dados()

if df.empty:
    st.warning("Nenhum dado disponível no banco.")
    st.stop()

# ===============================
# Métricas principais
# ===============================
col1, col2, col3 = st.columns(3)

ultimo = df.iloc[-1]

col1.metric(
    label="Carga Atual",
    value=f"{ultimo['percent']}%"
)

col2.metric(
    label="Status",
    value="🔌 Conectado" if ultimo["plugged"] else "🔋 Em uso"
)

col3.metric(
    label="Última Atualização",
    value=ultimo["timestamp"].strftime("%H:%M:%S")
)

st.divider()

# ===============================
# Gráfico de carga ao longo do tempo
# ===============================
st.subheader("📈 Evolução da Carga da Bateria")

st.line_chart(
    df.set_index("timestamp")["percent"]
)

# ===============================
# Filtro por período
# ===============================
st.subheader("📅 Análise por Período")

inicio = st.date_input("Data inicial", df["timestamp"].dt.date.min())
fim = st.date_input("Data final", df["timestamp"].dt.date.max())

df_filtrado = df[
    (df["timestamp"].dt.date >= inicio) &
    (df["timestamp"].dt.date <= fim)
]

st.area_chart(
    df_filtrado.set_index("timestamp")["percent"]
)

# ===============================
# Tabela de dados
# ===============================
st.subheader("📋 Registros Coletados")

st.dataframe(
    df_filtrado,
    use_container_width=True
)
