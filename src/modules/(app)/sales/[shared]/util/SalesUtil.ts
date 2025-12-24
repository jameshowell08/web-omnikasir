class SalesUtil {
    public static mapStatusLabel(status: string) {
        return status === "SUCCESS" ? "Selesai" : status === "IN_PROGRESS" ? "Dalam proses" : status
    }
}

export default SalesUtil;