import os
import pandas as pd

export_name = "oldSchool_Metrics_View_export.csv"
standard_name = "metrics_table.csv"
database_name = "metrics_database.csv"

column_oldSchool = "oldSchool"
column_newBorn = "newBorn"
column_meaning = "meaning"
column_level = "level"
column_group = "group"

def remove_if_exist(name):
    if os.path.exists(name):
        os.remove(name)


def normalize_name():
    if os.path.exists(export_name):
        print("export file exist, do standard")
        remove_if_exist(standard_name)
        os.rename(export_name, standard_name)
    if os.path.exists(standard_name):
        trim_data(standard_name)


def apply_replace_html_space(item):
    return item.replace("\u00a0", " ")


def trim_data(filename):
    print("trim data")
    df = pd.read_csv(filename, names=[column_oldSchool, column_newBorn, column_meaning, column_level, column_group])
    df = df.drop(0)
    df = df.fillna("")
    df = df[df[column_meaning] != ""]
    df = df.map(apply_replace_html_space)
    df.to_csv(database_name, header=False, index=False)


if __name__ == "__main__":
    normalize_name()


