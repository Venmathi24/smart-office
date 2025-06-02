package com.springboot.demo.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;


public class RecurringResponseDTO
{
    private List<SuccessResponseDTO> successList;
    private List<ConflictResponseDTO> conflictList;

    public RecurringResponseDTO()
    {
        successList = new ArrayList<>();
        conflictList = new ArrayList<>();
    }



    public List<SuccessResponseDTO> getSuccessList() {
        return successList;
    }

    public void setSuccessObject(SuccessResponseDTO successDTO) {
        this.successList.add(successDTO);
    }

    public List<ConflictResponseDTO> getConflictList() {
        return conflictList;
    }

    public void setConflictObjec(ConflictResponseDTO conflictDTO) {
        this.conflictList.add(conflictDTO);
    }
}
