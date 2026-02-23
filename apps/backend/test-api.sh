#!/bin/bash

BASE_URL="http://localhost:3000/api"
TOKEN=""

# ========================
# AUTH
# ========================

login() {
  echo "=== LOGIN ==="
  http POST $BASE_URL/auth/login \
    email="admin@mail.com" \
    password="admin123"
}

# ========================
# KARYAWAN
# ========================

get_karyawan() {
  echo "=== GET KARYAWAN ==="
  http GET $BASE_URL/karyawan \
    Authorization:"Bearer $TOKEN"
}

create_karyawan() {
  echo "=== CREATE KARYAWAN ==="
  http POST $BASE_URL/karyawan/createKaryawan \
    Authorization:"Bearer $TOKEN" \
    nama="Budi Santoso" \
    email="budi@mail.com" \
    password="password123"
}

# ========================
# TRANSACTIONS
# ========================

get_transactions() {
  echo "=== GET TRANSACTIONS ==="
  http GET $BASE_URL/transactions \
    Authorization:"Bearer $TOKEN"
}

create_income() {
  echo "=== CREATE INCOME ==="
  http POST $BASE_URL/transactions/createIncome \
    Authorization:"Bearer $TOKEN" \
    title="Kas Mingguan" \
    amount:=50000 \
    userId:=1 \
    note="Pembayaran kas minggu ke-1"
}

edit_transaction() {
  echo "=== EDIT TRANSACTION ID=$1 ==="
  http PUT $BASE_URL/transactions/edit/$1 \
    Authorization:"Bearer $TOKEN" \
    title="Kas Bulanan" \
    amount:=100000 \
    note="Diubah jadi bulanan" \
    type="PEMASUKAN"
}

delete_transaction() {
  echo "=== DELETE TRANSACTION ID=$1 ==="
  http DELETE $BASE_URL/transactions/delete/$1 \
    Authorization:"Bearer $TOKEN"
}

# ========================
# HELP
# ========================

show_help() {
  echo "Cara pakai:"
  echo ""
  echo "  ./test-api.sh login                          Login, ambil token dari response"
  echo "  ./test-api.sh token TOKEN get-karyawan       List semua karyawan"
  echo "  ./test-api.sh token TOKEN create-karyawan    Buat karyawan baru"
  echo "  ./test-api.sh token TOKEN get-transactions   List semua transaksi"
  echo "  ./test-api.sh token TOKEN create-income      Buat pemasukan baru"
  echo "  ./test-api.sh token TOKEN edit-tx ID          Edit transaksi by ID"
  echo "  ./test-api.sh token TOKEN delete-tx ID        Hapus transaksi by ID"
  echo ""
  echo "Contoh flow:"
  echo "  1. ./test-api.sh login                         -> copy token dari response"
  echo "  2. ./test-api.sh token eyJ... get-karyawan     -> pakai token tadi"
  echo "  3. ./test-api.sh token eyJ... edit-tx 1        -> edit transaksi ID 1"
}

# ========================
# PARSE ARGUMENTS
# ========================

# Cek apakah ada flag 'token'
if [ "$1" = "token" ]; then
  TOKEN="$2"
  shift 2
fi

case "$1" in
  login)              login ;;
  get-karyawan)       get_karyawan ;;
  create-karyawan)    create_karyawan ;;
  get-transactions)   get_transactions ;;
  create-income)      create_income ;;
  edit-tx)            edit_transaction "$2" ;;
  delete-tx)          delete_transaction "$2" ;;
  help|"")            show_help ;;
  *)                  echo "Command tidak dikenal: $1"; show_help ;;
esac
